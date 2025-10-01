import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"
import { Layout } from "../components/layout"
import "./styles/globals.css"
import { AuthProvider } from "../providers/auth-provider"

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
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            <Layout>{children}</Layout>
            <Toaster
              position="bottom-right"
              expand={false}
              richColors
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
