import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { getUserFromCookie } from './functions/functions';

export async function middleware(request: NextRequest) {

    const role  = await getUserFromCookie();
 

  // Rutas protegidas por rol
  const url = request.nextUrl.pathname;

  const isEditRoute = /^\/articulos\/[^\/]+\/editar$/.test(url);
  const isNewArticleRoute = url === '/articulos/nuevo-articulo';
//Redirige a unauthorized si no tiene permisos para editar o crear
  if ((isEditRoute || isNewArticleRoute) && role > 2 || role == null) {
    return NextResponse.redirect(new URL('/unauthorized', request.url)); // o /login
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/articulos/nuevo-articulo',
    '/articulos/:slug*/editar',
    '/'
  ],
};
