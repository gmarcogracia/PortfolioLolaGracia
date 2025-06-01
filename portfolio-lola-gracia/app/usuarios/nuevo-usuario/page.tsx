'use client';
import Link from "next/link";
import { FormEvent } from "react";

export default function Users() {
  async function crearUsuario(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}users/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if(!data.user){
      window.alert(data.message);
    }
    console.log(data);

 
  }

  return (
    <>
      <h1>Hey {process.env.NEXT_PUBLIC_BACKEND_ADDRESS}</h1>
      <div>
        <form onSubmit={crearUsuario}>
          <input type="text" name="username" id="username" placeholder="Nombre de Usuario" />
          <input type="password" name="password" id="password" placeholder="Contraseña" />
          <input type="submit" value="Crear Usuario" />
           <Link href={'./'}>Iniciar Sesión</Link>
       
        </form>
      </div>
    </>
  );
}
