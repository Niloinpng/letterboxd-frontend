import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Busca o token no cookie
  const token = localStorage

  // Rotas públicas que não precisam de autenticação
  const publicPaths = ['/']

  // Verifica se a rota atual é pública
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname)

  // Se não tem token e não está em rota pública, redireciona para login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Se tem token e está na página de login, redireciona para dashboard
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/home', request.url))
  }
}

// Configura quais rotas serão verificadas pelo middleware
export const config = {
  matcher: [
    '/',
    '/feed/:id',
    '/film/:id',
    '/home',
    '/profile/:id',
  ]
}