'use client';
/* eslint-disable no-unused-expressions */

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Loader,
  Title,
  Button,
  TextInput,
  Center,
  Container,
  Group,
} from '@mantine/core';
import { IconBrandTwitter } from '@tabler/icons-react';
import { useEditorContext } from '@/context/editorContext';
import TiptapEditor from '@/app/articulos/components/texteditor';
import { getUserFromCookie } from '@/app/functions/functions';

export default function EditArticlePage() {
  const [role, setRole] = useState<number | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const { slug } = useParams<{ slug: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [articleId, setArticleId] = useState<string | null>(null);
  const { editor } = useEditorContext();
  const router = useRouter();



  //Susituto del middleware
  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      try {
        setLoading(true);
        const roleFromCookie = await getUserFromCookie();
        if (!isMounted) return;

        console.log("Rol obtenido:", role);
        
        if (roleFromCookie === null || roleFromCookie > 2) {
          console.log("Redirigiendo a no autorizado");
          router.push('.././unauthorized');
          return;
        }

        setRole(roleFromCookie);
      } catch (error) {
        console.error("Error en verificación de auth:", error);
        if (!isMounted) return;
        router.push('../unauthorized');
      } finally {
        if (isMounted){

        setAuthChecked(true);
        setLoading(false);
      }

      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);



  // Cargar artículo
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}articles/${slug}`);
        const data = await res.json();

        setTitle(data.title);
        setContent(data.content || '');
        setArticleId(data.id);
      } catch (err) {
        console.error('Error cargando artículo:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  // Cargar contenido en editor
  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  const handleSave = async () => {
    if (!editor || !articleId) return;

    const updated = {
      title,
      content: editor.getHTML(),
    };

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updated),
      });

      if (res.ok) {
        setLoading(false);
        alert("Artículo editado");
        router.push('/articulos');
      } else {
        const errorData = await res.json();
        console.error('Error actualizando:', errorData);
      }
    } catch (err) {
      console.error('Error al guardar:', err);
    }
  };

  const handleTweet = () => {
    const html = editor?.getHTML() || '';
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const elements = doc.body.childNodes;

    let result = '';

    elements.forEach((el) => {
      if (el.nodeType === Node.ELEMENT_NODE) {
        const node = el as HTMLElement;

        switch (node.tagName) {
          case 'P':
            result += parseRichText(node) + '\n\n';
            break;
          case 'UL':
            node.querySelectorAll('li').forEach(li => {
              result += `• ${parseRichText(li)}\n`;
            });
            result += '\n';
            break;
          case 'OL':
            node.querySelectorAll('li').forEach((li, i) => {
              result += `${i + 1}. ${parseRichText(li)}\n`;
            });
            result += '\n';
            break;
          default:
            result += parseRichText(node) + '\n\n';
        }
      }
    });

    const tweetText = encodeURIComponent(result.slice(0, 280));
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(tweetUrl, '_blank');
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  return (
    <Container>
      <Title order={2} mb="md">Editar artículo</Title>

      <TextInput
        label="Título"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        mb="md"
      />

      <div
        style={{
          minHeight: '300px',
          overflow: 'auto',
          padding: '1rem',
          border: '1px solid #ced4da',
          borderRadius: '8px',
          backgroundColor: '#fff',
        }}
      >
        <TiptapEditor />
      </div>

      <Group justify="space-between" mt="xl">
        <Button leftSection={<IconBrandTwitter size={18} />} onClick={handleTweet} variant="light" color="blue">
          Tuitear contenido
        </Button>

        <Button onClick={handleSave} color="teal">
          Guardar cambios
        </Button>
      </Group>
    </Container>
  );
}

// Convierten el texto formateado del editor (Negrita y cursvia) a formato legible por twitter 

function parseRichText(node: HTMLElement): string {
  let text = '';

  node.childNodes.forEach(child => {
    //Si el texto es plano no lo convierte ni a bold ni a italic
    if (child.nodeType === Node.TEXT_NODE) {
      text += child.textContent;
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as HTMLElement;
      //Una etiqueta puede tener otra dentro, osea puede ser negrita y cursiva al mismo tiempo, por eso se le mete recursividad
      const inner = parseRichText(el);

      switch (el.tagName) {
        //En caso de que sea negrita se convierte a negrita
        case 'STRONG':
          text += toBold(inner);
          break;
            //En caso de que sea cursiva convierte a cursvia
        case 'EM':
          text += toItalic(inner);
          break;
        default:
          //Si no es ninguna de esas dos cosas se mantiene igual (LOs headings por ejemplo no son compatibles con twitter)
          text += inner;
      }
    }
  });

  return text;
}

function toBold(text: string): string {
  return text.replace(/./g, c => boldCharMap[c] || c);
}

function toItalic(text: string): string {
  return text.replace(/./g, c => italicCharMap[c] || c);
}

const boldCharMap: { [key: string]: string } = {
  a: '𝗮', b: '𝗯', c: '𝗰', d: '𝗱', e: '𝗲', f: '𝗳',
  g: '𝗴', h: '𝗵', i: '𝗶', j: '𝗷', k: '𝗸', l: '𝗹',
  m: '𝗺', n: '𝗻', o: '𝗼', p: '𝗽', q: '𝗾', r: '𝗿',
  s: '𝘀', t: '𝘁', u: '𝘂', v: '𝘃', w: '𝘄', x: '𝘅',
  y: '𝘆', z: '𝘇',
  A: '𝗔', B: '𝗕', C: '𝗖', D: '𝗗', E: '𝗘', F: '𝗙',
  G: '𝗚', H: '𝗛', I: '𝗜', J: '𝗝', K: '𝗞', L: '𝗟',
  M: '𝗠', N: '𝗡', O: '𝗢', P: '𝗣', Q: '𝗤', R: '𝗥',
  S: '𝗦', T: '𝗧', U: '𝗨', V: '𝗩', W: '𝗪', X: '𝗫',
  Y: '𝗬', Z: '𝗭',
};

const italicCharMap: { [key: string]: string } = {
  a: '𝘢', b: '𝘣', c: '𝘤', d: '𝘥', e: '𝘦', f: '𝘧',
  g: '𝘨', h: '𝘩', i: '𝘪', j: '𝘫', k: '𝘬', l: '𝘭',
  m: '𝘮', n: '𝘯', o: '𝘰', p: '𝘱', q: '𝘲', r: '𝘳',
  s: '𝘴', t: '𝘵', u: '𝘶', v: '𝘷', w: '𝘸', x: '𝘹',
  y: '𝘺', z: '𝘻',
  A: '𝘈', B: '𝘉', C: '𝘊', D: '𝘋', E: '𝘌', F: '𝘍',
  G: '𝘎', H: '𝘏', I: '𝘐', J: '𝘑', K: '𝘒', L: '𝘓',
  M: '𝘔', N: '𝘕', O: '𝘖', P: '𝘗', Q: '𝘘', R: '𝘙',
  S: '𝘚', T: '𝘛', U: '𝘜', V: '𝘝', W: '𝘞', X: '𝘟',
  Y: '𝘠', Z: '𝘡',
};
