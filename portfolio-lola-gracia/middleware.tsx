// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    // 1. Make request to backend WITH credentials
  const response = await fetch(new URL('/api/auth/validate', request.url), {
  credentials: 'include'
})

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`)
    }

    const user = await response.json()
    const role = user.roleId ?? null

    // 2. Authorization logic
    const { pathname } = request.nextUrl
    const isEditRoute = /^\/articulos\/[^\/]+\/editar$/.test(pathname)
    const isNewArticleRoute = pathname === '/articulos/nuevo-articulo'
    const isUsersRoute = pathname === '/usuarios/listado'

    if ((isEditRoute || isNewArticleRoute) && (role === null || role > 2)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    if (isUsersRoute && role !== 1) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware auth error:', error)
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }
}

export const config = {
  matcher: [
    '/articulos/nuevo-articulo',
    '/articulos/:slug*/editar',
    '/usuarios/listado'
  ]
}