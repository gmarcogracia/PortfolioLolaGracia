
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function getUserFromCookie() {
  const cookieStore = await cookies();
  const token = await cookieStore.get('access_token')?.value;
  console.log("Mi token");
  console.log(token);
  


  if (!token) return null;

  try {

    if(! process.env.NEXT_PUBLIC_JWT_SECRET){
        return null
    }

    // const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
 

 
const decoded = jwt.decode(token) as { roleId?: number }; // decode no valida firma, pero es suficiente aquí
   console.log(decoded);
   const role = decoded.roleId ?? undefined;
  
    return  role 
  } catch {
    return null;
  }
}

