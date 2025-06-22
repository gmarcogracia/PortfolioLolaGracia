
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function getUserFromCookie() {
  const cookieStore = await cookies();
  const token = await cookieStore.get('access_token')?.value;
  const allcookies =  await cookieStore.getAll();
  console.log(allcookies)
    console.log("Token")
    console.log(token);
  if (!token) return null;

  try {
    console.log( process.env.NEXT_PUBLIC_JWT_SECRET,token,)
    if(! process.env.NEXT_PUBLIC_JWT_SECRET){
        return null
    }

    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
 
  
    const role = decoded.roleId ?? null;
    return  role // Aquí puedes acceder al rol (decoded.role)
  } catch {
    return null;
  }
}

