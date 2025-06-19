'use client';

import { useEffect, useState } from 'react';
import { Card, Text, Title, Loader, Container, Grid, Button, Center } from '@mantine/core';
import DOMPurify from 'dompurify';
import Link from 'next/link';

type Article = {
  id: string;
  title: string;
  content: string;
  slug: string;
};

type Props = {
  role?: number;
};

export default function ArticleList({ role }: Props) {
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
        setArticles(data);
      } catch (error) {
        console.error('Error consiguiendo los artículos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading)
    return (
      <Center h="100vh">
        <Loader size="xl" />
      </Center>
    );

  return (
    <Container py="xl">
      <Title order={1} mb="xl" align="center">
        Artículos
      </Title>

      <Grid gutter="lg">
        {articles.map((article) => (
          <Grid.Col key={article.id} span={{ base: 12, sm: 6, md: 4 }}>
            <Card shadow="md" padding="lg" radius="md" withBorder h="100%" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <Title order={2} mb="xs">
                  {article.title}
                </Title>
                <Text
                  className="article-excerpt"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
                />
              </div>
              <Link href={`/articles/${article.slug}`} style={{ textDecoration: 'none', marginTop: '1rem' }}>
                <Button fullWidth variant="light" color="teal">
                  Leer más
                </Button>
              </Link>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <style jsx global>{`
        .article-excerpt {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </Container>
  );
}
