import ArticleList from './components/articleList';
import { getUserFromCookie } from '../functions/functions';
import { Button } from '@mantine/core';
import Link from 'next/link';
      
export default async function ArticulosPage() {
const role =await getUserFromCookie();
  return (
    <main >
      <ArticleList role={role ?? null} />
        {( role && role<= 2 ) && (
        <div style={{ marginBottom: '1rem' }}>
              <Link href={'/articulos/nuevo-articulo'}>
              {/* Se ha comentado  una linea que hacia que se pasase el rol encriptado junto a una clave secrita mediante la url
                 ?'+ btoa("role")  + "=$" +(btoa(role))
                
                +"&"+ btoa(encodeURIComponent("claveSecreta=223456")) } state={{role:role}} */}
<Button color="teal" >
            Crear nuevo artículo
          </Button>
          </Link>
        </div>
      )}
    </main>
  );
}
