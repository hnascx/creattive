import { env } from "./config/env"
import { buildServer } from "./config/server"
import { authRoutes } from "./routes/auth.routes"
import { categoryRoutes } from "./routes/category.routes"
import { productRoutes } from "./routes/product.routes"
import { uploadRoutes } from "./routes/upload.routes"

async function start() {
  try {
    const server = await buildServer()

    await server.register(authRoutes)
    await server.register(categoryRoutes)
    await server.register(productRoutes)
    await server.register(uploadRoutes)

    await server.listen({ port: env.PORT, host: "0.0.0.0" })

    console.log("\n🚀 Aplicação iniciada com sucesso!\n")
    console.log(`📱 Frontend: ${env.FRONTEND_URL}`)
    console.log(`⚙️  Backend: http://localhost:${env.PORT}\n`)
    console.log("🔐 Credenciais de acesso:")
    console.log(`   Usuário: ${env.ADMIN_USERNAME}`)
    console.log(`   Senha: ${env.ADMIN_PASSWORD}\n`)
    console.log("📝 Para ver os logs: docker-compose logs -f\n")
  } catch (err) {
    console.error("❌ Error starting server:", err)
    process.exit(1)
  }
}

start()
