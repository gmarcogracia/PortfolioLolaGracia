
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function getUserFromCookie() {
  const cookieStore = await cookies();
  const token = await cookieStore.get('access_token')?.value;
  console.log("Mi token");
  console.log(token)
  console.log('Frontend SECRET:', process.env.NEXT_PUBLIC_JWT_SECRET);
  


  if (!token) return null;

  try {

    if(! process.env.NEXT_PUBLIC_JWT_SECRET){
        return null
    }

    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    console.log(decoded);

 

  // @ts-expect-error Me voy a cagar en los muertos de typescript, esto lleva funcionando todo el desarrollo  y al desplegar se rompe. Aunque JWT.Payload puede tener propiedades custom como role Id
    const role = decoded.roleId ?? null;
  
    return  role 
  } catch {
    return null;
  }
}

