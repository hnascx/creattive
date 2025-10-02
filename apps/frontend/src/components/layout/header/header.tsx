"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useAuth } from "@/hooks/useAuth"
import { LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ActiveLink } from "../active-link"

export function Header() {
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl ml-2 md:ml-0 px-1 sm:px-6 md:px-1 lg:px-9">
        <div className="flex h-20 items-center justify-between">
          <Link href="/">
            <Image
              src="/creattive-logo.png"
              alt="Creattive"
              width={180}
              height={60}
            />
          </Link>

          <nav className="flex items-center gap-3 md:gap-4 px-5">
            <ActiveLink href="/">Produtos</ActiveLink>
            <ActiveLink href="/categories">Categorias</ActiveLink>
            <ThemeToggle />
            <Button variant="outline" size="icon" onClick={logout} title="Sair">
              <LogOut className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
