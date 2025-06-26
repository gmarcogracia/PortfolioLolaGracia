'use client';

import {
  Container,
  Title,
  Text,
  Stack,
  Group,
  Button,
  ActionIcon,
  Divider,
} from '@mantine/core';
import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandSpotify,
  IconBrandTiktok,
  IconMail,
} from '@tabler/icons-react';

export default function ContactPage() {
  return (
    <Container size="sm" py="xl">
      <Stack gap="sm" align="center">
        <Title order={1} ta="center">
          Contacto — Lola Gracia
        </Title>
        <Text size="lg" c="dimmed" ta="center">
          Puedes encontrarme en mis redes sociales o escribirme directamente.
        </Text>

        <Divider my="lg" w="100%" />

        {/* Social media */}
        <Group justify="center" mt="sm" gap="lg">
          <ActionIcon
            component="a"
            href="https://www.instagram.com/esteInstaEsDeEjemploPorTemasDeProteccionDeDatos"
            target="_blank"
            size="lg"
            variant="subtle"
            color="pink"
          >
            <IconBrandInstagram size="1.8rem" />
          </ActionIcon>

          <ActionIcon
            component="a"
            href="https://twitter.com/esteTwitterEsDeEjemploPorTemasDeProteccionDeDatos"
            target="_blank"
            size="lg"
            variant="subtle"
            color="blue"
          >
            <IconBrandTwitter size="1.8rem" />
          </ActionIcon>

          <ActionIcon
            component="a"
            href="https://www.tiktok.com/@esteTikTokEsDeEjemploPorTemasDeProteccionDeDatos"
            target="_blank"
            size="lg"
            variant="subtle"
            color="dark"
          >
            <IconBrandTiktok size="1.8rem" />
          </ActionIcon>

          <ActionIcon
            component="a"
            href="https://open.spotify.com/show/3lw6LqrkTNYz93INRWzOFN"
            target="_blank"
            size="lg"
            variant="subtle"
            color="green"
          >
            <IconBrandSpotify size="1.8rem" />
          </ActionIcon>
        </Group>

        {/* Email button */}
        <Button
          leftSection={<IconMail size="1.2rem" />}
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan' }}
          mt="xl"
          component="a"
          href="mailto:esteMailEsDeEjemploPorTemasDeProteccionDeDatos@gmail.com"
        >
          Escríbeme un correo y contacta conmigo
        </Button>
      </Stack>
    </Container>
  );
}
