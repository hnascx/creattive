"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthContext } from "@/providers/auth-provider"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { FormEvent, useState } from "react"
import { toast } from "sonner"

const DEFAULT_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin"
const DEFAULT_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin"

export default function LoginPage() {
  const [username, setUsername] = useState(DEFAULT_USERNAME)
  const [password, setPassword] = useState(DEFAULT_PASSWORD)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthContext()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      // Adicionar timeout de 2 segundos
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await login(username, password)
    } catch (error) {
      toast.error("Usuário ou senha inválidos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-14">
      <div className="w-full max-w-sm space-y-8 p-8 border rounded-lg shadow-lg">
        <div className="text-center space-y-6">
          <Image
            src="/creattive-logo.png"
            alt="Creattive Logo"
            width={200}
            height={200}
            className="mx-auto"
            priority
          />
          <div>
            <h2 className="text-2xl font-bold">Login</h2>
            <p className="mt-2">Faça login abaixo com as suas credenciais</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium">
              Usuário
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                Entrando
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
