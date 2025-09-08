'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@mantine/core'; // Puedes cambiar esto si usas otro UI framework
import { useEditorContext } from '@/context/editorContext';
import { useEffect } from 'react';

export default function TiptapEditor() {

    const editor = useEditor({
  extensions: [StarterKit],
  content: '',
    immediatelyRender: false,
  editorProps: {
    attributes: {
      class: 'tiptap ProseMirror',
    },

 
  },
})
  const { setEditor } = useEditorContext();

  // Se asigna el editor cuando esté listo
  useEffect(() => {
    if (editor) {
      setEditor(editor);
    }
  }, [editor, setEditor]);


  if (!editor) return null;



  return (
    <div>
      {/* Toolbar donde están los notones paera  */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Button variant="default" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()}>
          Negrita
        </Button>
        <Button variant="default" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()}>
          Cursiva
        </Button>
        <Button variant="default" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          Lista
        </Button>
        <Button variant="default" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          Lista Ordenada
        </Button>
  
        
        <Button variant="default" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          Encabezado 
        </Button>
        <Button variant="default" onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}>
          Encabezado Secundario
        </Button>
        <Button variant="default" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
          Limpiar texto (Quita negrita, encabezados, etc)
        </Button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="ProseMirror"  id="editorTexto"  style={{ padding: '1rem' }}/>
    
    </div>
  );
}
