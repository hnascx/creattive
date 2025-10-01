"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Product } from "@/services/product.service"
import { Pencil, Plus } from "lucide-react"
import { useState } from "react"
import { ProductForm } from "../product-form"

interface ProductDialogProps {
  product?: Product
  onSuccess: () => void
  mode?: "create" | "edit"
}

export function ProductDialog({
  product,
  onSuccess,
  mode = "create",
}: ProductDialogProps) {
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
            Novo Produto
          </Button>
        ) : (
          <Button variant="ghost" size="icon">
            <Pencil className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Novo Produto" : "Editar Produto"}
          </DialogTitle>
        </DialogHeader>
        <ProductForm
          product={product}
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
