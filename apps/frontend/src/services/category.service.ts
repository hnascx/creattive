import { api } from "../lib/axios"

export interface Category {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface CategoryInput {
  name: string
}

export const categoryService = {
  async list() {
    const response = await api.get<{ success: true, data: Category[] }>('/categories')
    return response.data.data
  },

  async create(data: CategoryInput) {
    const response = await api.post<{ success: true, data: Category }>('/categories', data)
    return response.data.data
  },

  async update(id: string, data: CategoryInput) {
    const response = await api.put<{ success: true, data: Category }>(`/categories/${id}`, data)
    return response.data.data
  },

  async delete(id: string) {
    await api.delete(`/categories/${id}`)
  }
}