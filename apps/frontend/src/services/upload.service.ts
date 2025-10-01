import { api } from "@/lib/axios"

export const uploadService = {
  async uploadImage(formData: FormData) {
    const response = await api.post<{
      success: boolean
      data: { imagePath: string }
    }>("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data.data
  },
}
