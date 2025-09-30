import { env } from "./config/env"
import { buildServer } from "./config/server"
import { authRoutes } from "./routes/auth.routes"
import { categoryRoutes } from "./routes/category.routes"
import { productRoutes } from "./routes/product.routes"

async function start() {
  try {
    const server = await buildServer()

    await server.register(authRoutes)
    await server.register(categoryRoutes)
    await server.register(productRoutes)

    await server.listen({ port: env.PORT, host: "0.0.0.0" })

    console.log(`🚀 Server running at http://localhost:${env.PORT}`)
  } catch (err) {
    console.error("❌ Error starting server:", err)
    process.exit(1)
  }
}

start()
