import { FastifyReply, FastifyRequest } from "fastify"
import { extractTokenFromHeader, verifyToken } from "../utils/jwt.utils"

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authorization = request.headers.authorization
    const token = extractTokenFromHeader(authorization)

    if (!token) {
      return reply.status(401).send({
        success: false,
        message: "Token não fornecido",
      })
    }

    const decoded = verifyToken(token)
    request.user = decoded
  } catch (error) {
    return reply.status(401).send({
      success: false,
      message: "Token inválido",
    })
  }
}
