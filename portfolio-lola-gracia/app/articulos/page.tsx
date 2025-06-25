'use client';

import { useEffect, useState } from 'react';
import ArticleList from './components/articleList';
import { getUserFromCookie } from '../functions/functions';
import { Button } from '@mantine/core';
import Link from 'next/link';

export default function ArticulosPage() {
  const [role, setRole] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchRole = async () => {
      const roleFromCookie = await getUserFromCookie();
      setRole(roleFromCookie ?? undefined);
    };
    fetchRole();
  }, []);

  return (
    <main>
      <ArticleList role={role ?? undefined} />
      {role && role <= 2 && (
        <div style={{ marginBottom: '1rem' }}>
          <Link href="/articulos/nuevo-articulo">
            <Button color="teal">Crear nuevo artículo</Button>
          </Link>
        </div>
      )}
    </main>
  );
}
