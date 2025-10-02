// apps/frontend/src/services/product.service.ts
import { api } from "@/lib/axios"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  expiryDate: string
  imagePath?: string
  categories: {
    id: string
    name: string
  }[]
  createdAt: string
  updatedAt: string
}

export interface ProductInput {
  name: string
  description: string
  price: number
  expiryDate: string
  categoryIds: string[]
  imageUrl?: string
}

interface ProductResponse {
  success: boolean
  data: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export const productService = {
  async list(params?: { search?: string; page?: number }) {
    try {
      // Garantir que page seja um número válido e positivo
      const page = Math.max(1, params?.page || 1)

      // Construir a URL base
      let url = "/products"
      const queryParts = []

      if (params?.search) {
        queryParts.push(`search=${encodeURIComponent(params.search)}`)
      }

      // Adicionar page como string simples
      queryParts.push(`page=${page}`)

      // Adicionar query string se houver parâmetros
      if (queryParts.length > 0) {
        url += `?${queryParts.join("&")}`
      }

      const response = await api.get<ProductResponse>(url)

      return {
        items: response.data.data,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages,
        hasNext: response.data.pagination.hasNext,
        hasPrev: response.data.pagination.hasPrev,
        currentPage: response.data.pagination.page,
      }
    } catch (error: any) {
      console.error("Erro detalhado:", {
        error,
        response: error.response?.data,
        params: params,
      })
      throw error
    }
  },

  async create(data: ProductInput) {
    const response = await api.post<{ success: boolean; data: Product }>(
      "/products",
      data
    )
    return response.data.data
  },

  async update(id: string, data: Partial<ProductInput>) {
    const response = await api.put<{ success: boolean; data: Product }>(
      `/products/${id}`,
      data
    )
    return response.data.data
  },

  async delete(id: string) {
    const response = await api.delete<{ success: boolean }>(`/products/${id}`)
    return response.data.success
  },
}
