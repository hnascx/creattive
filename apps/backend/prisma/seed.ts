import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const categories = [
  "Mercearia",
  "Hortifruti",
  "Carnes",
  "Laticínios",
  "Bebidas",
  "Padaria",
  "Congelados",
  "Limpeza",
  "Higiene Pessoal",
  "Biscoitos e Snacks",
  "Cereais",
  "Enlatados",
  "Condimentos",
  "Massas",
  "Doces",
  "Temperos",
  "Grãos",
  "Frios",
  "Orgânicos",
  "Diet e Light",
  "Bebidas Alcoólicas",
  "Sucos",
  "Refrigerantes",
  "Produtos Naturais",
  "Produtos Importados",
  "Produtos Zero Lactose",
  "Produtos Sem Glúten",
  "Produtos Veganos",
  "Produtos Pet",
  "Descartáveis",
]

const products = [
  { name: "Arroz Integral", category: "Grãos", price: 899 },
  { name: "Feijão Carioca", category: "Grãos", price: 799 },
  { name: "Leite Integral", category: "Laticínios", price: 499 },
  { name: "Pão Francês", category: "Padaria", price: 199 },
  { name: "Queijo Mussarela", category: "Frios", price: 3299 },
  { name: "Presunto", category: "Frios", price: 2899 },
  { name: "Banana Prata", category: "Hortifruti", price: 599 },
  { name: "Maçã Fuji", category: "Hortifruti", price: 899 },
  { name: "Detergente Líquido", category: "Limpeza", price: 299 },
  { name: "Sabão em Pó", category: "Limpeza", price: 1599 },
  { name: "Papel Higiênico", category: "Higiene Pessoal", price: 1899 },
  { name: "Creme Dental", category: "Higiene Pessoal", price: 399 },
  { name: "Coca-Cola 2L", category: "Refrigerantes", price: 899 },
  { name: "Cerveja", category: "Bebidas Alcoólicas", price: 499 },
  { name: "Biscoito Recheado", category: "Biscoitos e Snacks", price: 299 },
  { name: "Salgadinho", category: "Biscoitos e Snacks", price: 599 },
  { name: "Café em Pó", category: "Mercearia", price: 1299 },
  { name: "Açúcar Refinado", category: "Mercearia", price: 499 },
  { name: "Sal Refinado", category: "Mercearia", price: 299 },
  { name: "Óleo de Soja", category: "Mercearia", price: 799 },
  { name: "Macarrão Espaguete", category: "Massas", price: 399 },
  { name: "Molho de Tomate", category: "Mercearia", price: 299 },
  { name: "Atum em Lata", category: "Enlatados", price: 599 },
  { name: "Milho em Conserva", category: "Enlatados", price: 299 },
  { name: "Chocolate ao Leite", category: "Doces", price: 499 },
  { name: "Sorvete", category: "Congelados", price: 2499 },
  { name: "Pizza Congelada", category: "Congelados", price: 1699 },
  { name: "Iogurte Natural", category: "Laticínios", price: 599 },
  { name: "Margarina", category: "Laticínios", price: 699 },
  { name: "Ovos", category: "Mercearia", price: 1599 },
]

async function main() {
  console.log("🌱 Iniciando seed...")

  console.log("Limpando banco de dados...")
  await prisma.productCategory.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  console.log("Criando categorias...")
  const createdCategories = await Promise.all(
    categories.map((name) =>
      prisma.category.create({
        data: { name },
      })
    )
  )

  const categoryMap = createdCategories.reduce((acc, category) => {
    acc[category.name] = category.id
    return acc
  }, {} as Record<string, string>)

  console.log("Criando produtos...")
  await Promise.all(
    products.map((product) =>
      prisma.product.create({
        data: {
          name: product.name,
          description: `${product.name} de alta qualidade. Produto selecionado e com excelente custo-benefício.`,
          price: product.price,
          expiryDate: new Date(
            Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000
          ), // Data entre hoje e 6 meses
          imagePath:
            "https://cdn.awsli.com.br/800x800/1935/1935087/produto/100363383/casa-e-perfume-500-ml-sensualidade-035d0831.jpg",
          categories: {
            create: [
              {
                categoryId: categoryMap[product.category],
              },
            ],
          },
        },
      })
    )
  )

  console.log("✅ Seed finalizado!")
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
