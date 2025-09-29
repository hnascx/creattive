import { Input } from "@/components/ui/input"

export function Search() {
  return (
    <div>
      <Input
        placeholder="Filtrar por nome ou descrição..."
        className="bg-background border-border h-10"
      />
    </div>
  )
}
