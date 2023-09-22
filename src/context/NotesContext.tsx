import React, { FC, createContext, useContext, useState } from "react";

export type Note = {
  title: string;
  content: string;
  path: string;
};

interface NotesContext {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  activeNote: number;
  setActiveNote: (note: number) => void;
}

interface NotesContextProviderProps {
  children: React.ReactNode;
}

const NotesContext = createContext<NotesContext>({
  notes: [],
  setNotes: () => {},
  activeNote: 0,
  setActiveNote: () => {},
});

export function useNotesContext() {
  const context = useContext(NotesContext);
  if (!context)
    throw new Error(
      `Context 'NotesContext' is null. Did you use <NotesContextProvider>?`
    );
  return context;
}

export const NotesContextProvider: FC<NotesContextProviderProps> = ({
  children,
}) => {
  const [notes, setNotes] = useState<Note[]>([{title: 'teste', content: '## testando', path: 'sei la'}, {title: 'teste2', content: '> testando3', path: 'sei la'}]);
  const [activeNote, setActiveNote] = useState<number>(0);

  return (
    <NotesContext.Provider
      value={{ notes, setNotes, activeNote, setActiveNote }}
    >
      {children}
    </NotesContext.Provider>
  );
};
