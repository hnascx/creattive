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
import { categoryService } from "@/services/category.service"
import { Product, productService } from "@/services/product.service"
import Image from "next/image"
import { FormEvent, useEffect, useState } from "react"
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
  const [categoryIds, setCategoryIds] = useState<string[]>(
    product?.categories ? [product.categories[0].id] : []
  )
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState(
    product?.imagePath
      ? product.imagePath.startsWith("http")
        ? product.imagePath
        : `${API_URL}/${product.imagePath}`
      : ""
  )
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([])

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    try {
      const data = await categoryService.list()
      setCategories(data)
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
    setImagePreview(URL.createObjectURL(file))
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

    setLoading(true)

    try {
      let imageUrl = product?.imagePath
        ? product.imagePath.startsWith("http")
          ? product.imagePath
          : `${API_URL}/${product.imagePath}`
        : ""

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
          imageUrl = `${API_URL}${uploadData.data.imageUrl}`
        } else {
          throw new Error("Formato de resposta do upload inválido")
        }
      }

      const productData = {
        name,
        description,
        price: Number(price),
        expiryDate,
        categoryIds,
        imageUrl,
      }

      console.log("Dados finais do produto:", productData)

      if (product) {
        await productService.update(product.id, productData)
        toast.success("Produto atualizado com sucesso")
      } else {
        await productService.create(productData)
        toast.success("Produto criado com sucesso")
      }
      onSuccess()
    } catch (error: any) {
      console.error("Erro detalhado:", error)
      const message =
        error.response?.data?.message ||
        error.message ||
        "Erro ao salvar produto"
      toast.error(message)
    } finally {
      setLoading(false)
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
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="price">Preço</label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
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
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="categories">Categorias</label>
        <Select
          value={categoryIds[0]}
          onValueChange={(value) => setCategoryIds([value])}
        >
          <SelectTrigger>
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
        <label htmlFor="image">Imagem</label>
        <Input
          id="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageSelect}
        />
        {imagePreview && (
          <div className="mt-2">
            <Image
              src={imagePreview}
              alt="Preview"
              width={100}
              height={100}
              className="rounded-md object-cover"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : product ? "Atualizar" : "Criar"}
        </Button>
      </div>
    </form>
  )
}
