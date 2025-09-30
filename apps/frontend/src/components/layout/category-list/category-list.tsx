import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ActionButtons } from "../action-buttons"

const products = [
  {
    id: 1,
    name: "Categoria 1",
  },
  {
    id: 2,
    name: "Categoria 2",
  },
  {
    id: 3,
    name: "Categoria 3",
  },
  {
    id: 4,
    name: "Categoria 4",
  },
  {
    id: 5,
    name: "Categoria 5",
  },
]

export function CategoryList() {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Categorias</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={index} className="flex flex-row justify-between">
              <TableCell className="py-4">{product.name}</TableCell>
              <TableCell>
                <ActionButtons />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
