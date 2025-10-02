"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { categoryService } from "@/services/category.service"
import {
  Product,
  ProductInput,
  productService,
} from "@/services/product.service"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { FormEvent, useEffect, useState } from "react"
import CurrencyInput from "react-currency-input-field"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

interface ProductFormProps {
  product?: Product
  onSuccess: () => void
  onCancel: () => void
}

export function ProductForm({
  product,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const [name, setName] = useState(product?.name || "")
  const [description, setDescription] = useState(product?.description || "")
  const [price, setPrice] = useState(product?.price?.toString() || "")
  const [expiryDate, setExpiryDate] = useState(
    product?.expiryDate?.split("T")[0] || ""
  )
  const [categoryIds, setCategoryIds] = useState<string[]>(() => {
    if (!product?.categories?.length) return []
    const validCategories = product.categories.filter((c) => c && c.id)
    return validCategories.length ? [validCategories[0].id] : []
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [existingImageName, setExistingImageName] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([])

  useEffect(() => {
    loadCategories()
  }, [])

  function getImageUrl(imagePath: string | undefined | null) {
    if (!imagePath) return null

    // Substitui todas as ocorrências de barras duplicadas por uma única barra
    return imagePath.replace(/([^:]\/)\/+/g, "$1")
  }

  useEffect(() => {
    if (product?.imagePath) {
      const fullImageUrl = getImageUrl(product.imagePath)
      console.log("URL da imagem:", {
        original: product.imagePath,
        processed: fullImageUrl,
      })
      setImagePreview(fullImageUrl || "")
      // Extrair o nome do arquivo da URL
      const fileName = product.imagePath.split("/").pop() || "imagem existente"
      setExistingImageName(fileName)
    }
  }, [product])

  async function loadCategories() {
    try {
      const data = await categoryService.list()
      setCategories(data.items)
    } catch (error) {
      toast.error("Erro ao carregar categorias")
    }
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo do arquivo
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipo de arquivo não suportado. Use JPEG, PNG ou WEBP")
      return
    }

    // Validar tamanho (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo de 2MB")
      return
    }

    setImageFile(file)
    const objectUrl = URL.createObjectURL(file)
    console.log("URL do objeto criado:", objectUrl)
    setImagePreview(objectUrl)
    setExistingImageName("") // Limpar o nome da imagem existente quando uma nova é selecionada
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    // Validações
    if (description.length < 10) {
      toast.error("A descrição deve ter no mínimo 10 caracteres")
      return
    }

    if (Number(price) <= 0) {
      toast.error("O preço deve ser maior que zero")
      return
    }

    const today = new Date()
    const selectedDate = new Date(expiryDate)
    if (selectedDate <= today) {
      toast.error("A data de validade deve ser futura")
      return
    }

    if (categoryIds.length === 0) {
      toast.error("Selecione pelo menos uma categoria")
      return
    }

    try {
      let imageUrl = ""

      // Só tenta fazer upload se houver um arquivo selecionado
      if (imageFile) {
        const formData = new FormData()
        formData.append("file", imageFile)

        const response = await fetch(`${API_URL}/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Erro ao fazer upload da imagem")
        }

        const uploadData = await response.json()
        console.log("Resposta do upload:", uploadData)

        if (uploadData.success && uploadData.data) {
          imageUrl = getImageUrl(uploadData.data.imageUrl) || ""
        } else {
          throw new Error("Formato de resposta do upload inválido")
        }
      } else if (product?.imagePath) {
        imageUrl = getImageUrl(product.imagePath) || ""
      }

      // Validação extra dos dados antes do envio
      const priceValue = Number(
        price
          .replace(/[R$\s.]/g, "") // Remove R$, espaços e pontos
          .replace(",", ".") // Substitui vírgula por ponto para o JavaScript entender
      )

      if (isNaN(priceValue)) {
        throw new Error("Preço inválido")
      }

      // Validar se a URL da imagem está completa
      if (!imageUrl.startsWith("http")) {
        throw new Error("URL da imagem inválida")
      }

      const productData: ProductInput = {
        name: name.trim(),
        description: description.trim(),
        price: priceValue,
        expiryDate,
        categoryIds,
        imageUrl,
      }

      console.log("Dados enviados para criação:", productData)

      if (product) {
        setLoading(true)
        await productService.update(product.id, productData)

        await new Promise((resolve) => setTimeout(resolve, 2000))
        toast.success("Produto atualizado com sucesso")

        setLoading(false)
        onSuccess()
      } else {
        setCreating(true)
        const response = await productService.create(productData)
        console.log("Resposta da criação:", response)

        await new Promise((resolve) => setTimeout(resolve, 2000))
        toast.success("Produto criado com sucesso")

        setCreating(false)
        onSuccess()
      }
    } catch (error: any) {
      console.error("Erro completo:", {
        message: error.message,
        response: error.response?.data,
        data: error.response?.data?.errors,
        status: error.response?.status,
      })
      const message =
        error.response?.data?.message ||
        error.message ||
        "Erro ao salvar produto"
      toast.error(message)
    } finally {
      setLoading(false)
      setCreating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name">Nome</label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          maxLength={100}
          className="mt-2"
          placeholder="Digite o nome do produto"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description">Descrição</label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          minLength={10}
          maxLength={500}
          className="mt-2"
          placeholder="Digite a descrição do produto"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="price">Valor</label>
        <CurrencyInput
          id="price"
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-2",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
          )}
          value={price}
          onValueChange={(value) => setPrice(value || "")}
          required
          prefix="R$ "
          decimalsLimit={2}
          decimalSeparator=","
          groupSeparator="."
          placeholder="Digite o valor do produto"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="expiryDate">Data de Validade</label>
        <Input
          id="expiryDate"
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          required
          min={new Date().toISOString().split("T")[0]}
          className="mt-2"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="categories">Categorias</label>
        <Select
          value={categoryIds[0]}
          onValueChange={(value) => setCategoryIds([value])}
          required
        >
          <SelectTrigger className="mt-2 w-full">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="image">
          Imagem
          <span className="ml-1 text-xs text-red-400">
            {!product && "(Campo obrigatório)"}
          </span>
        </label>
        <div className="relative flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => document.getElementById("image")?.click()}
            className="min-w-[120px] bg-zinc-200 hover:bg-zinc-300 text-black mt-2"
          >
            Selecionar Arquivo
          </Button>
          <span className="text-sm text-muted-foreground mt-2">
            {imageFile
              ? imageFile.name
              : existingImageName || "Nenhum arquivo selecionado"}
          </span>
          <Input
            id="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageSelect}
            className="hidden"
            required={!product?.imagePath}
          />
        </div>
        {imagePreview && (
          <div className="mt-4">
            <Image
              src={imagePreview}
              alt="Preview"
              width={100}
              height={100}
              className="rounded-md object-cover"
              priority={false}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading || creating}
          className="min-w-[100px]"
        >
          {loading ? (
            <>
              Salvando
              <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : creating ? (
            <>
              Criando
              <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : product ? (
            "Atualizar"
          ) : (
            "Criar"
          )}
        </Button>
      </div>
    </form>
  )
}
