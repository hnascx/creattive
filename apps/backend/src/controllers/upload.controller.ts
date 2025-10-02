import { MultipartFile } from "@fastify/multipart"
import { randomUUID } from "crypto"
import { FastifyReply, FastifyRequest } from "fastify"
import { createWriteStream } from "fs"
import fs from "fs/promises"
import path from "path"
import { pipeline } from "stream/promises"
import { env } from "../config/env"

export async function uploadImage(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const parts = request.parts()

    for await (const part of parts) {
      if (part.type === "file") {
        const file = part as MultipartFile

        const allowedMimes = ["image/jpeg", "image/png", "image/webp"]
        if (!allowedMimes.includes(file.mimetype)) {
          return reply.status(400).send({
            success: false,
            message: "Tipo de arquivo não permitido",
          })
        }

        const uploadDir = path.resolve(env.UPLOAD_PATH)
        await fs.mkdir(uploadDir, { recursive: true })

        const ext = path.extname(file.filename)
        const filename = `${randomUUID()}${ext}`
        const filepath = path.join(uploadDir, filename)

        await pipeline(file.file, createWriteStream(filepath))

        // Construir a URL completa
        const baseUrl = `http://localhost:${env.PORT}`
        const imageUrl = `${baseUrl}/uploads/${filename}`

        return reply.send({
          success: true,
          data: {
            imageUrl,
          },
        })
      }
    }

    return reply.status(400).send({
      success: false,
      message: "Nenhum arquivo enviado",
    })
  } catch (error) {
    console.error("Erro no upload:", error)
    return reply.status(500).send({
      success: false,
      message: "Erro ao fazer upload da imagem",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    })
  }
}
