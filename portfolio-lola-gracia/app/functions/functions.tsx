
//Se ha comentado la mitad del codigo porque se rompe en produccion
// import  { JwtPayload } from 'jsonwebtoken';
//   // import { cookies } from 'next/headers';

// // 
// interface 
// DecodedToken extends JwtPayload {
//   roleId?: number;
// }

export async function getUserFromCookie(): Promise<number | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}auth/getUserByCookie`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      // Si es un error esperado (como 401), no se muestra
      if (response.status === 401) {
        return null;
      }

   
      return null;
    }

    const user = await response.json();
    return user.roleId ?? null;
  } catch {
  
    return null;
  }
}
