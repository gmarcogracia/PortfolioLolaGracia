'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import {
  Container,
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Divider,
  Anchor,
} from '@mantine/core';

export default function CrearUsuario() {
  const [loading, setLoading] = useState(false);

  async function crearUsuario(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!data.username) {
        alert(data.message);
      } else {
        alert("Bienvenido " + data.username);
        window.location.href = "./"; // Redirige al login
      }
    } catch (error) {
      console.error("Error al crear usuario:", error);
      alert("Hubo un error al crear el usuario.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container size="xs" my="xl">
      <Title align="center" mb="md">Crear nuevo usuario</Title>

      <Paper shadow="md" radius="md" p="xl" withBorder>
        <form onSubmit={crearUsuario}>
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
            Crear usuario
          </Button>

          <Divider my="lg" label="¿Ya tienes cuenta?" labelPosition="center" />

          <Anchor component={Link} href="./" ta="center" size="sm">
            Iniciar sesión
          </Anchor>
        </form>
      </Paper>
    </Container>
  );
}
