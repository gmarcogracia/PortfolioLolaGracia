'use client';

import { useState, FormEvent } from 'react';
import { Container, TextInput, PasswordInput, Button, Paper, Title,  Divider, Anchor } from '@mantine/core';
import Link from 'next/link';

export default function Users() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!data.username) {
        window.alert(data.message);
      } else {
        alert("Bienvenid@ " + data.username);
        window.location.href = "../";
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Esa contraseña o usuario no existen");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container size="xs" my="xl">
      <Title ta="center" mb="md">Iniciar sesión</Title>

      <Paper shadow="md" radius="md" p="xl" withBorder>
        <form onSubmit={onSubmit}>
          <TextInput
            label="Nombre de usuario"
            name="username"
            placeholder="Ingresa tu nombre de usuario"
            required
            mb="sm"
          />

          <PasswordInput
            label="Contraseña"
            name="password"
            placeholder="••••••••"
            required
            mb="md"
          />

          <Button type="submit" fullWidth loading={loading} color="teal" radius="md">
            Iniciar sesión
          </Button>

          <Divider my="lg" label="¿No tienes cuenta?" labelPosition="center" />

          <Anchor component={Link} href="/usuarios/nuevo-usuario" ta="center" size="sm">
            Crear nuevo usuario
          </Anchor>
        </form>
      </Paper>
    </Container>
  );
}
