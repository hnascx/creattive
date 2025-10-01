import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

// Rotas que não precisam de autenticação
const publicRoutes = ["/login"]

export function middleware(request: NextRequest) {
  // Pegar o token dos cookies
  const token = request.cookies.get("token")

  // Pegar o pathname da URL atual
  const pathname = request.nextUrl.pathname

  // Se for rota pública, permite acesso
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Se não tiver token, redireciona para login
  if (!token) {
    const url = new URL("/login", request.url)
    return NextResponse.redirect(url)
  }

  // Se tiver token, permite acesso
  return NextResponse.next()
}

// Configurar em quais rotas o middleware será executado
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
