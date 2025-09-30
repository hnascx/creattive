import { FastifyInstance } from "fastify"
import { login } from "../controllers/auth.controller"

export async function authRoutes(app: FastifyInstance) {
  app.post(
    "/auth/login",
    {
      schema: {
        body: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string", minLength: 3 },
            password: { type: "string", minLength: 6 },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
              data: {
                type: "object",
                properties: {
                  token: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    login
  )
}
