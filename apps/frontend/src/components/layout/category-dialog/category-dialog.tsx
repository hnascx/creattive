"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Category } from "@/services/category.service"
import { Pencil, Plus } from "lucide-react"
import { useState } from "react"
import { CategoryForm } from "../category-form"

interface CategoryDialogProps {
  category?: Category
  onSuccess: () => void
  mode?: "create" | "edit"
}

export function CategoryDialog({
  category,
  onSuccess,
  mode = "create",
}: CategoryDialogProps) {
  const [open, setOpen] = useState(false)

  function handleSuccess() {
    onSuccess()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nova Categoria
          </Button>
        ) : (
          <Button variant="ghost" size="icon">
            <Pencil className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Nova Categoria" : "Editar Categoria"}
          </DialogTitle>
        </DialogHeader>
        <CategoryForm
          category={category}
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
