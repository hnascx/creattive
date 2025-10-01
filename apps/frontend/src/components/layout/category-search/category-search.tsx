"use client"

import { Input } from "@/components/ui/input"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

export function CategorySearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSearch = useDebouncedCallback((term: string) => {
    console.log("Buscando categoria:", term) // Debug
    const params = new URLSearchParams(searchParams.toString())

    if (term) {
      params.set("search", term)
    } else {
      params.delete("search")
    }

    router.replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <div>
      <Input
        placeholder="Filtrar por categoria..."
        className="bg-background border-border h-10"
        defaultValue={searchParams.get("search")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  )
}
