
//Se ha comentado la mitad del codigo porque se rompe en produccion
// import  { JwtPayload } from 'jsonwebtoken';
//   // import { cookies } from 'next/headers';

// // 
// interface 
// DecodedToken extends JwtPayload {
//   roleId?: number;
// }

export async function getUserFromCookie(): Promise<number | null> {


// console.log("ENtra en general")

//   if (process.env.NEXT_PUBLIC_ENV=="LOCAL"){
  
//     console.log("Entra a local")
// //No funciona en produccion
//   const cookieStore = await cookies();
//   const token = cookieStore.get('access_token')?.value;


//   console.log(cookieStore.getAll());


//   if (!token) return null;

//   try {
//     const decoded = jwt.decode(token) as DecodedToken | null;

   

//     if (!decoded || typeof decoded !== 'object') return null;

//     return decoded.roleId ?? null;
//   } catch (error) {
//     console.error("Error al decodificar token:", error);
//     return null;
//   }
//   }else{

    console.log("ESta entrando a la version de produccion");
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}auth/getUserByCookie`, {
  method: 'GET',
  credentials: 'include',
   headers: { 'Content-Type': 'application/json' },
});
const user = await response.json();
console.log("User from cookie");
console.log(user);
return user.roleId ?? null;


  // }
  
}
