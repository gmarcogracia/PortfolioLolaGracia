'use client'

import { createContext, useContext, useState } from 'react'
import { Editor } from '@tiptap/react'

type EditorContextType = {
  editor: Editor | null
  setEditor: (editor: Editor) => void
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)

export const EditorProvider = ({ children }: { children: React.ReactNode }) => {
  const [editor, setEditor] = useState<Editor | null>(null)

  return (
    <EditorContext.Provider value={{ editor, setEditor }}>
      {children}
    </EditorContext.Provider>
  )
}

export const useEditorContext = () => {
  const context = useContext(EditorContext)
  if (!context) throw new Error('useEditorContext must be used within an EditorProvider')
  return context
}
