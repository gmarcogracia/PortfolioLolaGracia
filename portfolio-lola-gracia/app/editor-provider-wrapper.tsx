'use client';

import { EditorProvider } from '@/context/editorContext';

export default function EditorProviderWrapper({ children }: { children: React.ReactNode }) {
  return <EditorProvider>{children}</EditorProvider>;
}
