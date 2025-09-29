import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Layout } from "../components/layout"
import "./styles/globals.css"

export const metadata: Metadata = {
  title: "Creattive | Gerenciamento de produtos",
  description: "Gerencie seus produtos de forma fácil e eficiente",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  )
}
