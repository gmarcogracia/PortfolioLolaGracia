'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  Text,
  Title,
  Loader,
  Container,
  Grid,
  Button,
  Center,
  Tooltip,
  Group,
} from '@mantine/core';
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

export default function ArticleList({ role = 4 }: Props) {
  if (!role){
    role = 4;
  }
  console.log("ROle" ,role);
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
            <Card
              shadow="md"
              padding="lg"
              radius="md"
              withBorder
              h="100%"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <Title order={2} mb="xs">
                  {article.title}
                </Title>
                <Text
                  className="article-excerpt"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
                />
              </div>

              <Group mt="md" grow>
                <Link href={`/articulos/${article.slug}`} style={{ textDecoration: 'none' }}>
                  <Button fullWidth variant="light" color="teal">
                    Leer más
                  </Button>
                </Link>

                {role <= 2 ? (
                  <Link href={`/articulos/${article.slug}/editar`} style={{ textDecoration: 'none' }}>
                    <Button fullWidth variant="filled" color="blue">
                      Editar
                    </Button>
                  </Link>
                ) : ""}
              </Group>
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
