import { api } from "@/lib/axios"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

export function useAuth() {
  const router = useRouter()

  async function login(username: string, password: string) {
    try {
      const response = await api.post("/auth/login", { username, password })
      const token = response.data.data.token

      Cookies.set("token", token, { expires: 1 })

      api.defaults.headers.Authorization = `Bearer ${token}`

      router.push("/")
    } catch (error) {
      throw error
    }
  }

  function logout() {
    Cookies.remove("token")
    delete api.defaults.headers.Authorization
    router.push("/login")
  }

  return { login, logout }
}
