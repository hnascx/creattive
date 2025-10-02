// apps/frontend/src/components/layout/product-list/product-list.tsx
"use client"

import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Pagination } from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Product, productService } from "@/services/product.service"
import { Trash2 } from "lucide-react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { ProductDialog } from "../product-dialog"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    loadProducts()
  }, [searchParams, currentPage])

  async function loadProducts() {
    try {
      setLoading(true)
      const search = searchParams.get("search") ?? undefined

      // Garantir que a página seja válida
      const page = Math.max(1, currentPage)

      const data = await productService.list({
        search,
        page,
      })

      setProducts(data.items)
      setTotalPages(data.totalPages)
      setHasNext(data.hasNext)
      setHasPrev(data.hasPrev)
      setCurrentPage(data.currentPage)
    } catch (error) {
      console.error("Erro ao carregar produtos:", error)
      toast.error("Erro ao carregar produtos")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await productService.delete(id)
      toast.success("Produto excluído com sucesso")
      await loadProducts()
    } catch (error) {
      toast.error("Erro ao excluir produto")
    }
  }

  function getImageUrl(imagePath: string | undefined | null) {
    if (!imagePath) return null

    // Substitui todas as ocorrências de barras duplicadas por uma única barra
    return imagePath.replace(/([^:]\/)\/+/g, "$1")
  }

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Produtos</h2>
        <ProductDialog onSuccess={loadProducts} mode="create" />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Data de validade</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.imagePath && (
                      <Image
                        src={getImageUrl(product.imagePath) || ""}
                        alt={product.name}
                        width={50}
                        height={50}
                        className="rounded-sm object-cover"
                        priority={false}
                      />
                    )}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(product.price))}
                  </TableCell>
                  <TableCell>
                    {new Date(
                      new Date(product.expiryDate).getTime() + 86400000
                    ).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    {product.categories?.length > 0
                      ? product.categories
                          .map((c) => c.name)
                          .filter(Boolean)
                          .join(", ")
                      : "Sem categoria"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <ProductDialog
                        product={product}
                        onSuccess={loadProducts}
                        mode="edit"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(product.id)}
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

        {products.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasNext={hasNext}
            hasPrev={hasPrev}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) {
            await handleDelete(deleteId)
          }
        }}
        title="Excluir produto"
        description="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
      />
    </div>
  )
}
