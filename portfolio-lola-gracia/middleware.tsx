import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // 1. Extract the access_token cookie from the incoming request
  const accessToken = request.cookies.get('access_token')?.value;
  console.log("Access token")
  console.log(accessToken);

  // If no token exists, redirect to unauthorized
  if (!accessToken) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  try {
    // 2. Call your backend API with the token
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}auth/getUserByCookie`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Forward only the specific cookie your backend needs
        'Cookie': `access_token=${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const user = await response.json();
    const role = user.roleId ?? null;

    // 3. Authorization logic
    const pathname = request.nextUrl.pathname;
    const isEditRoute = /^\/articulos\/[^\/]+\/editar$/.test(pathname);
    const isNewArticleRoute = pathname === '/articulos/nuevo-articulo';
    const isUsersRoute = pathname === '/usuarios/listado';

    // Article editing requires role <= 2
    if ((isEditRoute || isNewArticleRoute) && (role === null || role > 2)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // User management requires admin role (1)
    if (isUsersRoute && role !== 1) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware authentication error:', error);
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
}

export const config = {
  matcher: [
    '/articulos/nuevo-articulo',
    '/articulos/:slug*/editar',
    '/usuarios/listado'
  ],
};