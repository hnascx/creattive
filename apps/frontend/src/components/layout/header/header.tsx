import { ThemeToggle } from "@/components/ui/theme-toggle"

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b-1">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <span className="text-2xl font-bold">Logo</span>

          <nav className="flex items-center gap-6">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
