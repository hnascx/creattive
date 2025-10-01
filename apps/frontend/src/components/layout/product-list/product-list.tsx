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
import { Product, productService } from "@/services/product.service"
import { Trash2 } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { ProductDialog } from "../product-dialog"

// Constante para a URL base do backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      const data = await productService.list()
      console.log("Produtos carregados:", data)
      setProducts(data.items)
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

  if (loading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Produtos</h2>
        <ProductDialog onSuccess={loadProducts} mode="create" />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
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
                      src={
                        product.imagePath.startsWith("http")
                          ? product.imagePath
                          : `${API_URL}/${product.imagePath}`
                      }
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
                  {new Date(product.expiryDate).toLocaleDateString()}
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
                      onClick={() => handleDelete(product.id)}
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
    </div>
  )
}
