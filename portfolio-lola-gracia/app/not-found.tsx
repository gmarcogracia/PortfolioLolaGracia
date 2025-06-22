'use client';

import { Button, Container, Group, Text, Title } from '@mantine/core';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container size="md" py={80} style={{ textAlign: 'center' }}>
      <Title order={1} size="h2" mb="sm" style={{ fontWeight: 700 }}>
        404 - Página no encontrada
      </Title>

      <Text c="dimmed" size="lg" mb="xl">
        Lo sentimos, la página que estás buscando no existe o ha sido eliminada.
        <br />
        Asegúrate de que la URL sea correcta.
      </Text>

      <Group justify="center">
        <Button component={Link} href="/" size="md" variant="filled" color="blue">
          Volver al inicio
        </Button>
      </Group>
    </Container>
  );
}
