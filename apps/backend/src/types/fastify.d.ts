import { AuthPayload } from "./index"

declare module "fastify" {
  interface FastifyRequest {
    user: AuthPayload
  }
}
