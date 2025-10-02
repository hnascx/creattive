import { Search } from "../../components/layout/search"
import { Products } from "./sections"

export function Homepage() {
  return (
    <div className="flex flex-col min-h-screen mx-auto max-w-7xl px-6 lg:px-14">
      <div className="flex flex-col gap-8">
        <Search />
        <Products />
      </div>
    </div>
  )
}
