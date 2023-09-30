import { Markdown } from "tiptap-markdown";
import { useEditor, EditorContent } from "@tiptap/react";
import CharacterCount from "@tiptap/extension-character-count";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { FC, useState } from "react";
import { open } from "@tauri-apps/api/shell";
import { Note } from "../context/NotesContext";
import { writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import { getPath } from "../lib/utils";

interface NoteProps {
  note: Note;
}

const Note: FC<NoteProps> = ({ note }) => {
  const [referencias, setReferencias] = useState<string[]>([]);
  const [novaReferencia, setNovaReferencia] = useState<string>();
  const urlRegex = /^(https?:\/\/)?(www\.[^\s/$.?#].[^\s]*)$/i;

  const adicionarReferencia = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const referenciasAtualizadas = [...referencias, novaReferencia!];
    setReferencias(referenciasAtualizadas);
    e.currentTarget.reset();
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
        limit: 700,
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
        <EditorContent
          spellCheck={false}
          className=" bg-inherit prose-sm prose prose-invert leading-3 w-full my-4"
          editor={editor}
        />
        <hr />
        <h3 className="text-2xl font-black text-zinc-200 my-4">Referências</h3>
        <form onSubmit={adicionarReferencia}>
          <input
            className="w-full focus:outline-none placeholder-zinc-300 text-zinc-200 bg-inherit"
            placeholder="Adicionar referência"
            onChange={(e) => setNovaReferencia(e.currentTarget.value)}
          />
          <input
            type="submit"
            className="hidden absolute"
            id="nova_referencia"
          />
        </form>

        <ul className="flex flex-col gap-2 list-disc px-5 my-4">
          {referencias.map((referencia) => (
            <li key={referencia}>
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
