import { z } from "zod"

export const loginSchema = z.object({
  username: z.string().min(3, "O nome de usuário deve ter no mínimo 3 caracteres"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
})

export type LoginInput = z.infer<typeof loginSchema>
