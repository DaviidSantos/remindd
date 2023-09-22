import { Markdown } from "tiptap-markdown";
import { useEditor, EditorContent } from "@tiptap/react";
import CharacterCount from "@tiptap/extension-character-count";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { FC, useState } from "react";
import { open } from "@tauri-apps/api/shell";
import { Note } from "../context/NotesContext";

interface NoteProps {
  note: Note;
}

const Note: FC<NoteProps> = ({ note }) => {
  const [title, setTitle] = useState(note.title);
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
    content: note.content,
    autofocus: true,
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
  });

  return (
    <div className="w-full h-full bg-zinc-50 border-l">
      <div className="h-fit w-3/4 py-6 px-4 mx-auto my-4 border rounded-md">
        <input
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          type="text"
          className="w-full font-black text-2xl focus:outline-none placeholder-zinc-700 bg-inherit"
          placeholder="Titulo da anotação"
        />
        <EditorContent
          spellCheck={false}
          className=" bg-inherit prose-sm prose leading-3 w-full my-4"
          editor={editor}
        />
        <hr />
        <h3 className="text-2xl font-black my-4">Referências</h3>
        <form onSubmit={adicionarReferencia}>
          <input
            className="w-full focus:outline-none placeholder-zinc-700 bg-inherit"
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
            <li key="referencia">
              {urlRegex.test(referencia) ? (
                <button
                  className="text-blue-800 underline"
                  onClick={async () => await open(referencia)}
                >
                  {referencia}
                </button>
              ) : (
                <span>{referencia}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Note;
