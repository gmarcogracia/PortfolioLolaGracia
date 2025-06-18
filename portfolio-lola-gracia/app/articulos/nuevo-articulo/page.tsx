'use client';

import { useEditorContext } from '@/context/editorContext';
import { Button } from '@mantine/core';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Lazy load del editor para evitar problemas con SSR
const TiptapEditor = dynamic(() => import('../components/texteditor'), { ssr: false });

export default function Page() {
  const { editor } = useEditorContext();
  const [urlChunk, setUrlChunk] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUrl = window.location.href;
    console.log("URL actual:", currentUrl);

    try {
    
      let chunk = currentUrl.split("?")[1];
      if (!chunk) {
     
        router.push("../unauthorized");
        return;
      }

      // Separar y obtener la parte codificada
      chunk = chunk.split("&")[0]?.split("$")[1];

      if (!chunk) {

        router.push("../unauthorized");
        return;
      }

      // Decodificar con atob
      const decoded = atob(chunk);
      console.log("Rol decodificado:", decoded);

      // Validar rol (ej. solo usuarios con rol < 3 pueden continuar)
      const numericRole = parseInt(decoded);
      if (isNaN(numericRole) || numericRole >= 3) {
        console.log("Rol no autorizado, redireccionando...");
        router.push("../unauthorized");
        return;
      }


    } catch (e) {
      console.error("Error procesando la URL:", e);
      router.push("../unauthorized");
    }
  }, [router]);

  const handleSave = async () => {
    const htmlContent = editor?.getHTML() || '';
    const title = (document.getElementById("titulo") as HTMLInputElement)?.value;
    const slug = title.trim().replaceAll(" ", "-");

    if (!htmlContent || !title) {
      alert("Por favor introduce un título y texto.");
      return;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}articles/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ content: htmlContent, title, slug }),
    });

    if (!response.ok) {
      window.alert("Se ha producido un error");
    } else {
      alert("Artículo creado con éxito");
   
      router.push('./');
    }
  };

  return (
    <main>
      <h1>Editor</h1>
      <input type='text' id="titulo" placeholder='Introduce un título' />
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Button onClick={handleSave} color="teal">
          Guardar
        </Button>
      </div>

      <TiptapEditor />
    </main>
  );
}
