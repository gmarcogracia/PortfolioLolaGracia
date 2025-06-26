/* eslint-disable @typescript-eslint/no-unused-vars*/
'use client';

import { useEditorContext } from '@/context/editorContext';
import {
  Button,
  Container,
  Paper,
  TextInput,
  Title,
  Notification,
  Group,
  Loader,
} from '@mantine/core';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IconCheck, IconBrandTwitter } from '@tabler/icons-react';
import { getUserFromCookie } from '@/app/functions/functions';

const TiptapEditor = dynamic(() => import('../components/texteditor'), { ssr: false });

//Se usara para convertir en negrita en los posts de twitter
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

//Se convertira en cursiva
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

//Convierte el texto en negrita o en cursiva a formtato usable en twitter
function parseRichText(node: HTMLElement): string {
  let text = '';

  node.childNodes.forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      text += child.textContent;
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as HTMLElement;
      const inner = parseRichText(el);

      switch (el.tagName) {
        case 'STRONG':
          text += toBold(inner);
          break;
        case 'EM':
          text += toItalic(inner);
          break;
        default:
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

export default function EditorPage() {
  const router = useRouter();
  const [role, setRole] = useState<number | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const { editor } = useEditorContext();
  const [title, setTitle] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // Loader para guardar
  const [tweeting, setTweeting] = useState(false); // Loader para tuit

  //Susituto del middleware
  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      try {
        const roleFromCookie = await getUserFromCookie();
        if (!isMounted) return;
        
        if (roleFromCookie === null || roleFromCookie > 2) {
          router.push('../unauthorized');
          return;
        }

        setRole(roleFromCookie);
      } catch (error) {
        console.error("Error en verificación de auth:", error);
        if (!isMounted) return;
        router.push('../unauthorized');
      } finally {
        if (isMounted) setAuthChecked(true);
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (!authChecked) {
    return (
      <Container size="md" py="xl">
        <Paper shadow="sm" radius="md" p="lg" withBorder>
          <Title order={2} mb="lg" ta="center">
            Verificando permisos...
          </Title>
        </Paper>
      </Container>
    );
  }

  const handleSave = async () => {
    setLoading(true);

    const htmlContent = editor?.getHTML() || '';
    const slug = title.trim().replaceAll(' ', '-');

    if (!htmlContent || !title) {
      alert('Por favor introduce un título y texto.');
      setLoading(false);
      return;
    }
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}articles/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ content: htmlContent, title, slug }),
    });

    setLoading(false);

    if (!response.ok) {
      alert('Se ha producido un error');
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('./');
      }, 1500);
    }
  };

  const handleTweet = () => {
    setTweeting(true);

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
    setTimeout(() => setTweeting(false), 500); // Espera breve para simular carga
  };

  return (
    <Container size="md" py="xl">
      <Paper shadow="sm" radius="md" p="lg" withBorder>
        <Title order={2} mb="lg" ta="center">
          Crear nuevo artículo
        </Title>

        <TextInput
          label="Título"
          placeholder="Introduce un título atractivo"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          mb="md"
          withAsterisk
        />

        <div
          id="editorWrapper"
          style={{
            minHeight: '300px',
            maxHeight: 'auto',
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
          <Button 
            leftSection={tweeting ? <Loader size="xs" /> : <IconBrandTwitter size={18} />}
            onClick={handleTweet}
            variant="light"
            color="blue"
            disabled={tweeting}
            title="We're still not calling it X, you manchild"
          >
            {tweeting ? 'Generando tuit...' : 'Tuitear contenido'}
          </Button>

          <Button
            onClick={handleSave}
            color="teal"
            disabled={loading}
            leftSection={loading && <Loader size="xs" />}
          >
            {loading ? 'Guardando...' : 'Guardar artículo'}
          </Button>
        </Group>
      </Paper>

      {success && (
        <Notification
          icon={<IconCheck size={18} />}
          color="teal"
          title="Éxito"
          mt="md"
          onClose={() => setSuccess(false)}
        >
          Artículo creado con éxito
        </Notification>
      )}
    </Container>
  );
}
