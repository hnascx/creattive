import { FastifyInstance } from "fastify"
import { uploadImage } from "../controllers/upload.controller"
import { authMiddleware } from "../middleware/auth.middleware"

export async function uploadRoutes(app: FastifyInstance) {
  app.register(async function (protectedRoutes) {
    protectedRoutes.addHook("preHandler", authMiddleware)

    protectedRoutes.post("/upload", uploadImage)
  })
}
