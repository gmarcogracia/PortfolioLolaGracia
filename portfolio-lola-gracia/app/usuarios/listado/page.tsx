/* eslint-disable @typescript-eslint/no-unused-vars*/
'use client';
import { useEffect, useState } from 'react';
import {
  Container,
  Title,
  Table,
  Button,
  Loader,
  Center,
  Paper,
  ScrollArea,
} from '@mantine/core';
import { getUserFromCookie } from '@/app/functions/functions';
import { useRouter } from 'next/navigation';

type User = {
  userid: string;
  username: string;
  roleId: number;
};

export default function UsuariosList() {
  const router = useRouter();
  const [role, setRole] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtrar usuarios que NO son administradores (roleId !== 1). No puedes quitarle permisos a otro admin

  const nonAdminUsers = users.filter(user => user.roleId !== 1);

  // Sustituto del middleware 
  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      try {
        setLoading(true);
        const roleFromCookie = await getUserFromCookie();
        if (!isMounted) return;
        
        // Solo permitir acceso a administradores (roleId = 1)
        // Only allow access to admins (roleId = 1)
        if (roleFromCookie === null || roleFromCookie !== 1) {
          router.push('../unauthorized');
          return;
        }

        setRole(roleFromCookie);
      } catch (error) {
        console.error("Error en verificación", error);
        if (!isMounted) return;
        router.push('../unauthorized');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  // Obtener lista de usuarios 
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}users/list`, {
        credentials: 'include',
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  };

  // Cargar usuarios tras ver que tiene permisos y no esta cargando
  useEffect(() => {
  if (!loading && role === 1) {
    fetchUsers();
  }
}, [role]);

  // Manejar cambio de rol 
  const handleGrantRole = async (userid: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}users/${userid}`, {
        method: 'PATCH',
        credentials: 'include',
      });
    
      if (res.ok) {
        // Actualizar lista después de cambiar rol para reflejar los cambios

        await fetchUsers();
      }
    } catch (error) {
      console.error('Error al otorgar rol:', error);
    }
  };

  // Manejar eliminación de usuario / Handle user deletion
  const handleDelete = async (userid: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}users/${userid}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        // Eliminar usuario de la lista localmente sin necesidad de refrescar
       
        setUsers(prevUsers => prevUsers.filter(user => user.userid !== userid));
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  // Mostrar pantalla de carga
  if (loading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Title ta="center" mb="lg">
        Lista de usuarios
      </Title>

      <Paper shadow="sm" radius="md" p="md" withBorder>
        <ScrollArea>
          <Table striped highlightOnHover withRowBorders style={{ fontSize: '14px' }}>
            <thead>
              <tr>
                <th style={{ width: '20%', textAlign: 'left' }}>Nombre</th>
                <th style={{ width: '40%', textAlign: 'left' }}>Id</th>
                <th style={{ width: '20%', textAlign: 'center' }}>Rol actual</th>
                <th style={{ width: '20%', textAlign: 'center' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {nonAdminUsers.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <Center>No hay usuarios registrados (que no sean administradores)</Center>
                  </td>
                </tr>
              ) : (
                nonAdminUsers.map((user) => (
                  <tr key={user.userid}>
                    <td style={{ width: '20%' }}>{user.username}</td>
                    <td style={{ width: '40%', wordBreak: 'break-all' }}>{user.userid}</td>
                    <td style={{ width: '20%', textAlign: 'center' }}>
                      {user.roleId === 2 ? "Editor" : "Usuario"}
                    </td>
                    <td style={{ width: '20%', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <Button
                          variant="outline"
                          color="teal"
                          radius="md"
                          size="xs"
                          onClick={() => handleGrantRole(user.userid)}
                        >
                          {user.roleId === 2 ? 'Ascender a administrador' : 'Ascender a editor'}
                        </Button>
                        <Button
                          variant="outline"
                          color="red"
                          radius="md"
                          size="xs"
                          onClick={() => handleDelete(user.userid)}
                        >
                          Eliminar usuario
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </ScrollArea>
      </Paper>
    </Container>
  );
}