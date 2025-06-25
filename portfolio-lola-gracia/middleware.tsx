import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserFromCookie } from './app/functions/functions';
//Se usa jose (Nombre gracioso, i know porque el middleware es incompatible con jsonWebtoken)
// import { jwtVerify } from 'jose';

//Esto ya no se necesita porque  ahora se hace desde elbackend
// async function getRoleFromToken(token: string | undefined): Promise<number | null> {
//   if (!token) return null;

//   try {
//     const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);
//     const { payload } = await jwtVerify(token, secret);
//     return payload.roleId as number;
//   } catch (err) {
//     console.error("JWT inválido:", err);
//     return null;
//   }
// }

export async function middleware(request: NextRequest) {
  // const token = request.cookies.get('access_token')?.value;
  const role = await getUserFromCookie();
  console.log("ROleMiddleware",role);
  console.log("Cookies")
  console.log(request.cookies)



  const pathname = request.nextUrl.pathname;

  const isEditRoute = /^\/articulos\/[^\/]+\/editar$/.test(pathname);
  const isNewArticleRoute = pathname === '/articulos/nuevo-articulo';
  //COntrol de gestion de usuarios solo para admins
  const isUsersRoute = pathname  === '/usuarios/listado';


  if ((isEditRoute || isNewArticleRoute) && (role === null || role > 2)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  //Solo pueden entrar admins a la getsion de usuarios para otorgar roles

  if ((isUsersRoute) && (role === null || role !=1)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

//sI las urls coinciden con una de las indicadas en el matcher se ejecuta el middleware
export const config = {
  matcher: [
    '/articulos/nuevo-articulo',
    '/articulos/:slug*/editar',
    '/usuarios/listado'
  ],
};
