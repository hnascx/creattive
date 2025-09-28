import { ThemeProvider } from "next-themes"
import { Layout } from "../components/layout"
import "./styles/globals.css"

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
