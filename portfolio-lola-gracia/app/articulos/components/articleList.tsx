'use client';

import { useEffect, useState } from 'react';
import { Card, Text, Title, Stack, Loader, Container } from '@mantine/core';
import DOMPurify from 'dompurify';

type Article = {
  id: string;
  title: string;
  content: string;
  slug:string
};
type Props = {
  role?: number; // Puede ser undefined si no está logueado
};

export default function ArticleList({ role }: Props) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}articles/`,{
          method:'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        console.log(res);
        console.log(data);
        setArticles(data);
      } catch (error) {
        console.error('Error consiguiendo los articulos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <Loader />;

  return (
    <Container>
      <Title order={2} mb="md">Artículos</Title>
      <Stack spacing="md">
        {articles.map((article) => (
            
          <Card key={article.id} shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4}>{article.title}</Title>
           <div className="contenedorHtml"  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} >
            </div>
              
              
          
          </Card>
        ))}
      </Stack>
    </Container>
  );
}
