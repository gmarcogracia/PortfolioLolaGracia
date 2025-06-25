'use client';

import {
  Burger,
  Button,
  Container,
  Drawer,
  Group,
  Paper,
  Stack,
  rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';


//Si no hago esto salta un fallo de typescript
interface NavbarProps {
  roleId: number | null;
}

export default async function Navbar({ roleId }: NavbarProps) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const pathname = usePathname();
 

  useEffect(() => {
    close();
  }, [pathname, close]);

  const links = [
    ...(roleId === 1 ? [{ label: 'Usuarios', href: '/usuarios/listado' }] : []),
  
    { label: 'Artículos', href: '/articulos' },
    { label: 'Podcasts', href: '/podcast' },
  ];

  return (
    <Paper shadow="sm" withBorder style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <Container
        size="lg"
        py="sm"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Link href="/" style={{ fontWeight: 700, fontSize: rem(20), textDecoration: 'none' }}>
          Mi Sitio
        </Link>

        {/* Desktop links */}
        <Group visibleFrom="sm" gap="md">
          {links.map((link) => (
            <Button
              key={link.href}
              variant={pathname === link.href ? 'filled' : 'subtle'}
              component={Link}
              href={link.href}
              size="sm"
            >
              {link.label}
            </Button>
          ))}
        </Group>

        {/* Mobile burger */}
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" />
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        title="Navegación"
        padding="md"
        size="xs"
        hiddenFrom="sm"
        zIndex={1001}
      >
        <Stack gap="sm">
          {links.map((link) => (
            <Button
              key={link.href}
              variant="light"
              component={Link}
              href={link.href}
              size="md"
              fullWidth
            >
              {link.label}
            </Button>
          ))}
        </Stack>
      </Drawer>
    </Paper>
  );
}
