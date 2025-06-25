// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    // 1. Make request to backend WITH credentials
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}auth/getUserByCookie`,
      {
        method: 'GET',
        credentials: 'include', // Crucial for cross-domain cookies
        headers: {
          'Content-Type': 'application/json',
          // Forward the original request's cookies
          'Cookie': request.headers.get('Cookie') || ''
        }
      }
    )

    if (!backendResponse.ok) {
      throw new Error(`Backend responded with ${backendResponse.status}`)
    }

    const user = await backendResponse.json()
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