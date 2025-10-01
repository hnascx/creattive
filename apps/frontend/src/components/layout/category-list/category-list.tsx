"use client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Category, categoryService } from "@/services/category.service"
import { Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { CategoryDialog } from "../category-dialog"

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    try {
      const data = await categoryService.list()
      setCategories(data)
    } catch (error) {
      toast.error("Erro ao carregar categorias")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await categoryService.delete(id)
      toast.success("Categoria excluída com sucesso")
      await loadCategories()
    } catch (error) {
      toast.error("Erro ao excluir categoria")
    }
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Categorias</h2>
        <CategoryDialog onSuccess={loadCategories} mode="create" />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="w-[100px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <CategoryDialog
                    category={category}
                    onSuccess={loadCategories}
                    mode="edit"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
