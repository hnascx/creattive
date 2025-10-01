// apps/frontend/src/components/ui/confirm-dialog.tsx
"use client"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
  title: string
  description: string
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false)

  async function handleConfirm(e: React.MouseEvent) {
    e.preventDefault()
    try {
      setLoading(true)

      // Primeiro espera 2 segundos com o modal aberto
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Depois executa a ação de confirmação
      await onConfirm()
    } finally {
      setLoading(false)
      onOpenChange(false)
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(open) => !loading && onOpenChange(open)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
            className="min-w-[100px]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo
              </>
            ) : (
              "Confirmar"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
