import { ThemeToggle } from "@/components/ui/theme-toggle"
import Image from "next/image"
import Link from "next/link"
import { ActiveLink } from "../active-link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-9">
        <div className="flex h-20 items-center justify-between">
          <Link href="/">
            <Image
              src="/creattive-logo.png"
              alt="Creattive"
              width={180}
              height={60}
              className="mx-0"
            />
          </Link>

          <nav className="flex items-center gap-4 px-5">
            <ActiveLink href="/">Produtos</ActiveLink>
            <ActiveLink href="/categories">Categorias</ActiveLink>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
