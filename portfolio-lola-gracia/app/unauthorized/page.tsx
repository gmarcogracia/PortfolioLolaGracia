'use client';

import { Button, Center, Container, Paper, Text, Title } from '@mantine/core';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <Container size="sm" py="xl">
      <Paper shadow="md" radius="md" p="xl" withBorder>
        <Center>
      
        <Title
  order={2}
  style={{
    color: 'red',
    marginBottom: 'var(--mantine-spacing-sm)',
    textAlign: 'center',
  }}
>
            Acceso denegado
          </Title>
        </Center>
        <Text ta="center" size="md" mb="md">
          No tienes permisos para acceder a esta página.
        </Text>
        <Text ta="center" size="sm" color="dimmed" mb="lg">
          Por favor, asegúrate de haber iniciado sesión con una cuenta con los permisos necesarios.
        </Text>
        <Center>
          <Link href="/">
            <Button color="blue" variant="outline">
              Volver al inicio
            </Button>
          </Link>
        </Center>
      </Paper>
    </Container>
  );
}
