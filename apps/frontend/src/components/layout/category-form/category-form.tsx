// apps/frontend/src/components/layout/category-form/category-form.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Category, categoryService } from "@/services/category.service"
import { Loader2 } from "lucide-react"
import { FormEvent, useState } from "react"
import { toast } from "sonner"

interface CategoryFormProps {
  category?: Category
  onSuccess: () => void
  onCancel: () => void
}

export function CategoryForm({
  category,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const [name, setName] = useState(category?.name || "")
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (name.length < 2) {
      toast.error("O nome deve ter no mínimo 2 caracteres")
      return
    }

    try {
      if (category) {
        setLoading(true)
        await categoryService.update(category.id, { name })

        // Adiciona o timeout de 2 segundos antes do toast
        await new Promise((resolve) => setTimeout(resolve, 2000))
        toast.success("Categoria atualizada com sucesso")

        setLoading(false)
        onSuccess()
      } else {
        setCreating(true)
        await categoryService.create({ name })

        // Adiciona o timeout de 2 segundos antes do toast
        await new Promise((resolve) => setTimeout(resolve, 2000))
        toast.success("Categoria criada com sucesso")

        setCreating(false)
        onSuccess()
      }
    } catch (error: any) {
      console.error("Erro detalhado:", error)
      const message =
        error.response?.data?.message ||
        error.message ||
        "Erro ao salvar categoria"
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
          placeholder="Digite o nome da categoria"
        />
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
          ) : category ? (
            "Atualizar"
          ) : (
            "Criar"
          )}
        </Button>
      </div>
    </form>
  )
}
