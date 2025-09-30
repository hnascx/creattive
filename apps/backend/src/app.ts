import { env } from "./config/env"
import { buildServer } from "./config/server"

async function start() {
  try {
    const server = await buildServer()

    // Registrar rotas aqui posteriormente

    await server.listen({ port: env.PORT, host: "0.0.0.0" })

    console.log(`🚀 Server running at http://localhost:${env.PORT}`)
  } catch (err) {
    console.error("❌ Error starting server:", err)
    process.exit(1)
  }
}

start()
