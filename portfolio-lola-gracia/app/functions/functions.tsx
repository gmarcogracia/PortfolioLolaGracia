import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

type DecodedToken = {
  roleId?: number;
  [key: string]: any;
};

export async function getUserFromCookie(): Promise<number | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  console.log("🪙 Token recibido:", token);

  if (!token) return null;

  try {
    // ❗ En Server Components no uses jwt.verify, solo jwt.decode
    const decoded = jwt.decode(token) as DecodedToken | null;

    console.log("🔓 Token decodificado:", decoded);

    if (!decoded || typeof decoded !== 'object') return null;

    return decoded.roleId ?? null;
  } catch (error) {
    console.error("❌ Error al decodificar token:", error);
    return null;
  }
}
