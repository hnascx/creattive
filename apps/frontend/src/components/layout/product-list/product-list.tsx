import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from "next/image"
import { ActionButtons } from "../action-buttons"

const products = [
  {
    id: 1,
    name: "Produto 1",
    description: "Descrição do produto 1",
    price: 100,
    validityDate: "2025-01-01",
    category: "Categoria 1",
    image:
      "https://sublitransferbrasil.com.br/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/1/0/1060081677_garrafa_termica_1000ml_sublitransfer_2_.png.png",
  },
  {
    id: 2,
    name: "Produto 2",
    description: "Descrição do produto 2",
    price: 100,
    validityDate: "2025-01-01",
    category: "Categoria 1",
    image:
      "https://sublitransferbrasil.com.br/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/1/0/1060081677_garrafa_termica_1000ml_sublitransfer_2_.png.png",
  },
  {
    id: 3,
    name: "Produto 3",
    description: "Descrição do produto 3",
    price: 100,
    validityDate: "2025-01-01",
    category: "Categoria 1",
    image:
      "https://sublitransferbrasil.com.br/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/1/0/1060081677_garrafa_termica_1000ml_sublitransfer_2_.png.png",
  },
  {
    id: 4,
    name: "Produto 4",
    description: "Descrição do produto 4",
    price: 100,
    validityDate: "2025-01-01",
    category: "Categoria 1",
    image:
      "https://sublitransferbrasil.com.br/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/1/0/1060081677_garrafa_termica_1000ml_sublitransfer_2_.png.png",
  },
  {
    id: 5,
    name: "Produto 5",
    description: "Descrição do produto 5",
    price: 100,
    validityDate: "2025-01-01",
    category: "Categoria 1",
    image:
      "https://sublitransferbrasil.com.br/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/1/0/1060081677_garrafa_termica_1000ml_sublitransfer_2_.png.png",
  },
]

export function ProductList() {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Imagem</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Data de validade</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={index}>
              <TableCell className="py-4">
                <Image
                  src={product.image}
                  alt={`Imagem do ${product.name}`}
                  width={50}
                  height={50}
                  className="rounded-sm"
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>R$ {product.price.toFixed(2)}</TableCell>
              <TableCell>{product.validityDate}</TableCell>
              <TableCell>{product.category}</TableCell>
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
