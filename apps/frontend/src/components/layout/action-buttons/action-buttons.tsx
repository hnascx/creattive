import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

export function ActionButtons() {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        className="border-border hover:bg-accent"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="border-border hover:bg-accent"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
