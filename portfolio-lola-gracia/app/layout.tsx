import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { EditorProvider } from '@/context/editorContext';
import Navbar from './components/menu'; 
 import { getUserFromCookie } from './functions/functions';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio Lola Gracia",
  description: "Explora artículos y podcasts",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const roleId = await getUserFromCookie();

  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <EditorProvider>
          <MantineProvider>
            <Navbar  roleId={roleId ?? null}/> 
            {children}
          </MantineProvider>
        </EditorProvider>
      </body>
    </html>
  );
}
