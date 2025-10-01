"use client"

import Cookies from "js-cookie"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = Cookies.get("token")
    if (!token && pathname !== "/login") {
      router.push("/login")
    }
  }, [router, pathname])

  return <>{children}</>
}
