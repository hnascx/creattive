import cors from "@fastify/cors"
import multipart from "@fastify/multipart"
import staticFiles from "@fastify/static"
import Fastify from "fastify"
import fs from "fs/promises"
import path from "path"
import { env } from "./env"

export async function buildServer() {
  const server = Fastify({
    logger: false,
  })

  const uploadDir = path.resolve(env.UPLOAD_PATH)
  await fs.mkdir(uploadDir, { recursive: true })

  await server.register(cors, {
    origin: env.NODE_ENV === "development" ? true : [env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })

  await server.register(multipart, {
    limits: {
      fileSize: env.MAX_FILE_SIZE,
    },
    attachFieldsToBody: false,
  })

  await server.register(staticFiles, {
    root: uploadDir,
    prefix: "/uploads/",
    decorateReply: false,
  })

  return server
}
