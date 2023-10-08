import { Markdown } from "tiptap-markdown";
import { useEditor, EditorContent } from "@tiptap/react";
import CharacterCount from "@tiptap/extension-character-count";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { FC, useEffect, useState } from "react";
import { open } from "@tauri-apps/api/shell";
import { Note, useNotesContext } from "../context/NotesContext";
import { writeTextFile, BaseDirectory, readTextFile } from "@tauri-apps/api/fs";
import { getPath } from "../lib/utils";
import { NoteItem } from "../lib/types";
import NoteOptions from "./NoteOptions";

interface NoteProps {
  note: Note;
}

const Note: FC<NoteProps> = ({ note }) => {
  const { activeNote, notes, setNotes, setActiveNote } = useNotesContext();
  const [references, setReferences] = useState<string[]>([]);
  const [newReference, setNewReference] = useState<string>("");
  const urlRegex = /^(https?:\/\/)?(www\.[^\s/$.?#].[^\s]*)$/i;

  useEffect(() => {
    loadReferences();
  }, []);

  const loadReferences = async () => {
    const noteItems: NoteItem[] = JSON.parse(
      await readTextFile("Remind\\.config\\notes.json", {
        dir: BaseDirectory.Document,
      })
    );

    const noteItem = noteItems.find((noteItem) => noteItem.path === note.path);

    setReferences(noteItem!.references);
  };

  const adicionarReferencia = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedReferences = [...references, newReference];
    setReferences(updatedReferences);

    const noteItems: NoteItem[] = JSON.parse(
      await readTextFile("Remind\\.config\\notes.json", {
        dir: BaseDirectory.Document,
      })
    );

    const currentNote = noteItems.find(
      (noteItem) => noteItem.path === note.path
    );

    currentNote?.references.push(newReference);

    const extractedNotes = noteItems.filter(
      (noteItem) => noteItem.path !== note.path
    );

    setNewReference("");

    const updatedNotes = [...extractedNotes, currentNote];

    await writeTextFile(
      "Remind\\.config\\notes.json",
      JSON.stringify(updatedNotes),
      { dir: BaseDirectory.Document }
    );
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown,
      Placeholder.configure({
        placeholder: "Comece a escrever...",
      }),
      CharacterCount.configure({
        mode: "nodeSize",
        limit: 1000,
      }),
    ],
    onUpdate: ({ editor }) => {
      note.content = editor.storage.markdown.getMarkdown();
      saveNote();
    },
    content: note.content,
    autofocus: true,
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
  });

  const closeNote = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.which == 87) {
      if (e.ctrlKey) {
        const updatedNotes = notes.filter(
          (itemNote) => itemNote.title !== note.title
        );
        setNotes(updatedNotes);

        if (activeNote !== 0) {
          setActiveNote(activeNote - 1);
        }
      }
    }
  };

  const saveNote = async () => {
    const path = getPath(note.path);
    await writeTextFile(
      { path, contents: note.content },
      { dir: BaseDirectory.Document }
    );
  };

  return (
    <div className="w-full h-full bg-zinc-900">
      <div className="h-fit w-3/4 py-6 px-4 mx-auto my-4 border border-zinc-800 rounded-md">
        <h2 className="font-black text-2xl text-zinc-200">
          {note.title.replace(/\.md$/, "")}
        </h2>
        <NoteOptions path={note.path}/>
        <div className="border-y border-y-zinc-800">
          <EditorContent
            onKeyDown={closeNote}
            spellCheck={false}
            className=" bg-inherit prose-sm prose prose-invert leading-5 w-full my-4"
            editor={editor}
          />
        </div>
        <h3 className="text-2xl font-black text-zinc-200 my-4">Referências</h3>
        <form onSubmit={adicionarReferencia}>
          <input
            autoComplete="off"
            value={newReference}
            id="reference"
            className="w-full focus:outline-none placeholder-zinc-300 text-sm text-zinc-200 bg-inherit"
            placeholder="Adicionar referência"
            onChange={(e) => setNewReference(e.currentTarget.value)}
          />
          <input
            type="submit"
            className="hidden absolute"
            id="nova_referencia"
          />
        </form>

        <ul className="flex flex-col gap-2 list-disc px-5 my-4">
          {references &&
            references.map((referencia) => (
              <li key={referencia} className="marker:text-white text-sm">
                {urlRegex.test(referencia) ? (
                  <button
                    className="text-blue-800 underline"
                    onClick={async () => await open(referencia)}
                  >
                    {referencia}
                  </button>
                ) : (
                  <span className="text-zinc-200">{referencia}</span>
                )}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Note;
