import { api } from "@/lib/axios"

export interface Category {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface CategoryInput {
  name: string
}

interface CategoryResponse {
  success: boolean
  data: Category[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export const categoryService = {
  async list(params?: { search?: string; page?: number }) {
    try {
      const page = Math.max(1, params?.page || 1)
      const queryParts = []

      if (params?.search) {
        queryParts.push(`search=${encodeURIComponent(params.search)}`)
      }

      queryParts.push(`page=${page}`)

      const url =
        queryParts.length > 0
          ? `/categories?${queryParts.join("&")}`
          : "/categories"

      const response = await api.get<CategoryResponse>(url)

      return {
        items: response.data.data,
        total: response.data.pagination.total,
        totalPages: response.data.pagination.totalPages,
        hasNext: response.data.pagination.hasNext,
        hasPrev: response.data.pagination.hasPrev,
        currentPage: response.data.pagination.page,
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Erro ao listar categorias"
      throw new Error(message)
    }
  },

  async create(data: CategoryInput) {
    const response = await api.post<{ success: boolean; data: Category }>(
      "/categories",
      data
    )
    return response.data.data
  },

  async update(id: string, data: CategoryInput) {
    const response = await api.put<{ success: boolean; data: Category }>(
      `/categories/${id}`,
      data
    )
    return response.data.data
  },

  async delete(id: string) {
    const response = await api.delete<{ success: boolean }>(`/categories/${id}`)
    return response.data.success
  },
}
