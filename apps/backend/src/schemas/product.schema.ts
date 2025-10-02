import { z } from "zod"

const imageUrlSchema = z
  .string()
  .min(1, "URL da imagem é obrigatória")
  .optional()

const expiryDateSchema = z.string().refine((date) => {
  const parsedDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return parsedDate >= today
}, "Data de validade não pode ser anterior à data atual")

export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim(),
  description: z
    .string()
    .min(10, "Descrição deve ter no mínimo 10 caracteres")
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .trim(),
  price: z
    .number()
    .min(0.01, "Preço deve ser maior que zero")
    .max(999999.99, "Preço máximo excedido"),
  expiryDate: expiryDateSchema,
  categoryIds: z
    .array(z.string())
    .min(1, "Selecione pelo menos uma categoria")
    .max(5, "Máximo de 5 categorias permitido"),
  imageUrl: imageUrlSchema,
})

export const updateProductSchema = createProductSchema.partial()

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
