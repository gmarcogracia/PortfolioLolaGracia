
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function getUserFromCookie() {
  const cookieStore = await cookies();
  const token = await cookieStore.get('access_token')?.value;
  const allcookies =  await cookieStore.getAll();
  console.log(allcookies)

  if (!token) return null;

  try {
    console.log( process.env.NEXT_PUBLIC_JWT_SECRET,token,)
    if(! process.env.NEXT_PUBLIC_JWT_SECRET){
        return null
    }

    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);

 
  //Me voy a cagar en los muertos de typescript, esto lleva funcionando todo el desarrollo  y al desplegar se rompe. Aunque JWT.Payload puede tener propiedades custom como role Id
  // Esa linea hace que se ignore el error de typescript
  // @ts-expect-error
    const role = decoded.roleId ?? null;
    return  role 
  } catch {
    return null;
  }
}

