import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Category, CategoryInput, categoryService } from "@/services/category.service"
import { toast } from "sonner"

interface CategoryFormProps {
  category?: Category
  onSuccess: () => void
  onCancel: () => void
}

export function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(category?.name || "")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const data: CategoryInput = { name }
      
      if (category) {
        await categoryService.update(category.id, data)
        toast.success("Categoria atualizada com sucesso")
      } else {
        await categoryService.create(data)
        toast.success("Categoria criada com sucesso")
      }
      
      onSuccess()
    } catch (error) {
      toast.error(
        category 
          ? "Erro ao atualizar categoria" 
          : "Erro ao criar categoria"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Nome da categoria"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {category ? "Atualizar" : "Criar"}
        </Button>
      </div>
    </form>
  )
}