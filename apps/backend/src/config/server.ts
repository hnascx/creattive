import cors from "@fastify/cors"
import multipart from "@fastify/multipart"
import staticFiles from "@fastify/static"
import Fastify from "fastify"
import path from "path"
import { env } from "./env"

export async function buildServer() {
  const server = Fastify({
    logger: false, // Desabilita todos os logs do Fastify
  })

  await server.register(cors, {
    origin: [env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })

  await server.register(multipart, {
    limits: {
      fileSize: env.MAX_FILE_SIZE,
    },
  })

  await server.register(staticFiles, {
    root: path.join(__dirname, "../../..", env.UPLOAD_PATH),
    prefix: "/uploads/",
  })

  return server
}
