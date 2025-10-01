import { CategorySearch } from "@/components/layout/category-search"
import { Categories } from "./sections"

export function Category() {
  return (
    <div className="flex flex-col min-h-screen mx-auto max-w-7xl px-4 sm:px-6 lg:px-14">
      <div className="flex flex-col gap-8">
        <CategorySearch />
        <Categories />
      </div>
    </div>
  )
}
