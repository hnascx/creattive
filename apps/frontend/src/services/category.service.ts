import { api } from "@/lib/axios"

export interface Category {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export const categoryService = {
  async list(params?: { search?: string }) {
    const response = await api.get<{ success: boolean; data: Category[] }>(
      "/categories",
      {
        params,
      }
    )
    return response.data.data
  },

  async create(data: { name: string }) {
    const response = await api.post<{ success: boolean; data: Category }>(
      "/categories",
      data
    )
    return response.data.data
  },

  async update(id: string, data: { name: string }) {
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
