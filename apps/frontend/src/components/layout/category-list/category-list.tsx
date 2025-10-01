// apps/frontend/src/components/layout/category-list/category-list.tsx
"use client"

import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
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
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { CategoryDialog } from "../category-dialog"

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    loadCategories()
  }, [searchParams])

  async function loadCategories() {
    try {
      const search = searchParams.get("search") ?? undefined
      const data = await categoryService.list({ search })
      setCategories(data)
    } catch (error) {
      console.error("Erro ao carregar categorias:", error)
      toast.error("Erro ao carregar categorias")
      setCategories([])
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
          <TableRow className="hover:bg-transparent">
            <TableHead>Nome</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="text-center py-4">
                Nenhuma categoria encontrada
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
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
                      onClick={() => setDeleteId(category.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) {
            await handleDelete(deleteId)
          }
        }}
        title="Excluir categoria"
        description="Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita."
      />
    </div>
  )
}
