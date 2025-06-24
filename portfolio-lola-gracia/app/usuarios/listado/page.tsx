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

type User = {
  userid: string;
  username: string;

  roleId: number;
};

export default function UsuariosList() {
  const fetchUsers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}users/list`, {
          credentials: 'include',
        });
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error('Error cargando usuarios:', error);
      } finally {
        setLoading(false);
      }
    };

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  

    fetchUsers();
  }, []);

  const handleGrantRole = async (userid: string) => {
      try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}users/${userid}`, {
      method: 'PATCH',
      credentials: 'include',
    });
  
    if (res.ok) {
      //La lista solo muestra los no administradores
      fetchUsers();
    } else {
      console.error('Error al Otorgar rol');
    }
  } catch (error) {
    console.error('Error al Otorgar rrol', error);
  }
 
  };
 const handleDelete = async (userid: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}users/${userid}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (res.ok) {
      setUsers((prevUsers) => prevUsers.filter((user) => user.userid !== userid));
    } else {
      console.error('Error al eliminar usuario');
    }
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
  }
};

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
       <Table
  striped
  highlightOnHover
  withRowBorders
  style={{ fontSize: '14px' }} // ajusta según lo que desees
>

  <thead>
    <tr>
      <th style={{ width: '20%', textAlign: 'left' }}>Nombre</th>
      <th style={{ width: '40%', textAlign: 'left' }}>Id</th>
      <th style={{ width: '20%', textAlign: 'center' }}>Rol actual</th>
      <th style={{ width: '20%', textAlign: 'center' }}>Acción</th>
    </tr>
  </thead>
  <tbody>
    {users.length === 0 ? (
      <tr>
        <td colSpan={4}>
          <Center>No hay usuarios registrados. (Que no sean administradores)</Center>
        </td>
      </tr>
    ) : (
      users.map((user) => (
        <tr key={user.userid}>
          <td style={{ width: '20%' }}>{user.username}</td>
          <td style={{ width: '40%', wordBreak: 'break-all' }}>{user.userid}</td>
          <td style={{ width: '20%', textAlign: 'center' }}>{user.roleId ==2 ? "Editor" : "Usuario" 
            //Podría usarse el nombre de la tabla roles, pero como son pocos registros se puede hacer con un ternario
            }</td>
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
      Mandar usuario al abismo
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
