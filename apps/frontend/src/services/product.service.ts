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
  imageUrl: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
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
  async list(params?: { search?: string }) {
    const response = await api.get<PaginatedResponse<Product>>("/products", {
      params,
    })
    return {
      items: response.data.data,
      total: response.data.pagination.total,
    }
  },

  async create(data: ProductInput) {
    console.log("Dados enviados para criação:", data) // Log para debug
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
