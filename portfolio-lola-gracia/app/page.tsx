'use client';

import Link from 'next/link';
import { Container, Title, Text, Button, SimpleGrid, Card, Stack, Box } from '@mantine/core';

export default function HomePage() {
  return (
    <Container size="lg" py="xl">
      {/* Encabezado principal */}
      <Stack gap="sm" mb="xl" align="center">
        <Title order={1}>Hola, soy [Tu Nombre]</Title>
        <Text size="lg" c="dimmed" ta="center" maw={600}>
          Bienvenido a mi espacio. Soy [tu profesión/especialidad]. Aquí comparto mis proyectos, reflexiones y más.
        </Text>
      </Stack>

      {/* Secciones principales */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl" mb="xl">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={3} mb="xs">Proyectos</Title>
          <Text size="sm" c="dimmed">
            Una muestra de los trabajos que he realizado en diseño, desarrollo o investigación.
          </Text>
          <Button component={Link} href="/proyectos" mt="md" variant="light" color="blue">
            Ver proyectos
          </Button>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={3} mb="xs">Sobre mí</Title>
          <Text size="sm" c="dimmed">
            Descubre quién soy, qué me inspira y qué me motiva a crear.
          </Text>
          <Button component={Link} href="/about" mt="md" variant="light" color="blue">
            Conóceme
          </Button>
        </Card>
      </SimpleGrid>

      {/* Sección de Blog */}
      <Box mb="xl">
        <Title order={2} mb="md">Últimos posts del blog</Title>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {[
            {
              title: 'Cómo aprendí a trabajar en remoto',
              href: '/blog/remoto',
              excerpt: 'Una guía práctica basada en experiencia real sobre productividad y balance personal.'
            },
            {
              title: 'Mis herramientas de diseño favoritas',
              href: '/blog/herramientas',
              excerpt: 'Un repaso por apps que me acompañan día a día para crear de forma más fluida.'
            },
            {
              title: 'Consejos para freelancing sostenible',
              href: '/blog/freelance',
              excerpt: 'Sistemas, hábitos y mindset que me han ayudado a vivir del trabajo independiente.'
            }
          ].map((post, idx) => (
            <Card key={idx} shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={4} mb="xs">{post.title}</Title>
              <Text size="sm" c="dimmed" mb="sm">
                {post.excerpt}
              </Text>
              <Button component={Link} href={post.href} variant="subtle" color="blue" size="xs">
                Leer más →
              </Button>
            </Card>
          ))}
        </SimpleGrid>
      </Box>

      {/* Llamada a la acción final */}
      <Stack align="center" gap="xs">
        <Title order={2}>¿Trabajamos juntos?</Title>
        <Text c="dimmed" ta="center" maw={600}>
          Siempre estoy abierto a colaborar en proyectos interesantes, resolver problemas o simplemente charlar.
        </Text>
        <Button component={Link} href="/contacto" size="md" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
          Contactar
        </Button>
      </Stack>
    </Container>
  );
}
