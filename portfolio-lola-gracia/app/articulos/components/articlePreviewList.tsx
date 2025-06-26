'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  Text,
  Title,
  Loader,
  Grid,
  Button,
  Container,
} from '@mantine/core';
import DOMPurify from 'dompurify';
import Link from 'next/link';

type Article = {
  id: string;
  title: string;
  content: string;
  slug: string;
};

export default function ArticlePreviewList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}articles/`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        setArticles(data.slice(0, 3)); // mostrar solo los 3 más recientes
      } catch (error) {
        console.error('Error consiguiendo los artículos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <Loader size="md" mt="xl" />;

  return (
    <Grid gutter="lg">
      {articles.map((article) => (
        <Grid.Col key={article.id} span={{ base: 12, sm: 6, md: 4 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4} mb="xs">{article.title}</Title>
            <Text
              size="sm"
              c="dimmed"
              className="article-excerpt"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
            />
            <Button
              component={Link}
              href={`/articulos/${article.slug}`}
              variant="subtle"
              color="blue"
              size="xs"
              mt="sm"
            >
              Leer más →
            </Button>
          </Card>
        </Grid.Col>
      ))}

      <style jsx global>{`
        .article-excerpt {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </Grid>
  );
}
