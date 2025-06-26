'use client';

import Link from 'next/link';
import {
  Container,
  Title,
  Text,
  Button,
  SimpleGrid,
  Card,
  Stack,
  Box,
} from '@mantine/core';
import ArticlePreviewList from './articulos/components/articlePreviewList'

export default function HomePage() {
  return (
    <Container size="lg" py="xl">
      <Stack gap="sm" mb="xl" align="center">
        <Title order={1}>Hola, soy Lola Gracia, periodista y gestora de eventos personales</Title>
      </Stack>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl" mb="xl">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={3} mb="xs">Sobre mí</Title>
          <Text size="sm" c="dimmed">
            Soy una periodista y gestora de eventos culturales y literarios.
          </Text>
          <Button component={Link} href="/contacto" mt="md" variant="light" color="blue">
            Conóceme
          </Button>
        </Card>
      </SimpleGrid>

      <Box mb="xl">
        <Title order={2} mb="md">Últimos posts del blog</Title>
        <ArticlePreviewList />
      </Box>

      <Stack align="center" gap="xs">
        <Title order={2}>¿Trabajamos juntos?</Title>
        <Text c="dimmed" ta="center" maw={600}>
          ¿Necesitas gestionar un evento cultural?
        </Text>
        <Button
          component={Link}
          href="/contacto"
          size="md"
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan' }}
        >
          Contactar
        </Button>
      </Stack>
    </Container>
  );
}
