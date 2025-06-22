'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Container,
  Title,
  Text,
  Loader,
  Center,
  Paper,
  Divider,
  Box,
} from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';

export default function ArticleViewPage() {
  const { slug } = useParams<{ slug: string }>();
  const [title, setTitle] = useState('');
  const [html, setHtml] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}articles/${slug}`);
        const data = await res.json();

        setTitle(data.title);
        setHtml(data.content || '');
        setCreatedAt(data.createdAt || '');
      } catch (err) {
        console.error('Error al cargar el artículo:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  return (
    <Container size="md" py="xl">
      <Paper shadow="md" radius="lg" p="xl" withBorder>

        <Title order={1} mb="xs" style={{ fontSize: '2rem' }}>
          {title}
        </Title>

        {createdAt && (
          <Text size="sm" c="dimmed" mb="lg" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IconCalendar size={16} />
            {new Date(createdAt).toLocaleDateString()}
          </Text>
        )}

        <Divider mb="xl" />

        <Box
          dangerouslySetInnerHTML={{ __html: html }}
          style={{
            fontSize: '1.1rem',
            lineHeight: 1.7,
            color: '#333',
          }}
        />
      </Paper>
    </Container>
  );
}
