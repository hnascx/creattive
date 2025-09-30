import { FastifyReply, FastifyRequest } from "fastify"
import { env } from "../config/env"
import { LoginInput } from "../schemas/auth.schema"
import { generateToken } from "../utils/jwt.utils"

export async function login(
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) {
  const { username, password } = request.body

  if (username !== env.ADMIN_USERNAME || password !== env.ADMIN_PASSWORD) {
    return reply.status(401).send({
      success: false,
      message: "Credenciais inválidas",
    })
  }

  const token = generateToken(username)

  return reply.send({
    success: true,
    message: "Login realizado com sucesso",
    data: { token },
  })
}
