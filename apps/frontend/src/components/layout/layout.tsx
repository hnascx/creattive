"use client"

import { usePathname } from "next/navigation"
import { Header } from "./header"

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"

  return (
    <div className="min-h-screen">
      {!isLoginPage && <Header />}
      <main className={isLoginPage ? "" : "py-8"}>{children}</main>
    </div>
  )
}
