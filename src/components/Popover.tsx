import { FC, useEffect, useRef, useState } from "react";
import { useFileTreeContext } from "../context/FileTreeContext";
import Note from "./Note";
import { useNotesContext } from "../context/NotesContext";
import { extractFolderPath, getPath } from "../lib/utils";
import { readTextFile, BaseDirectory, writeTextFile } from "@tauri-apps/api/fs";
import { NoteItem } from "../lib/types";

interface PopoverProps {
  title: string;
  isError: boolean;
  setIsError: (isError: boolean) => void;
  setIsOpen: (isOpen: boolean) => void;
  placeholder: string;
  buttonText: string;
  errorMessage: string;
  action: (
    setIsOpen: (isOpen: boolean) => void,
    setIsError: (isError: boolean) => void,
    input: string | undefined,
    currentNode?: string
  ) => Promise<void>;
  actionType: string;
}

const Popover: FC<PopoverProps> = ({
  title,
  placeholder,
  buttonText,
  errorMessage,
  isError,
  setIsError,
  setIsOpen,
  action,
  actionType,
}) => {
  const componentRef = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState<string | undefined>();
  const { currentNode, readFileTree } = useFileTreeContext();
  const { notes, setNotes } = useNotesContext();

  const formSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await action(setIsOpen, setIsError, input, currentNode!);
    const folderPath = extractFolderPath(currentNode!);
    const beforeRename = notes.filter((note) => note.path === currentNode);

    const noteItems: NoteItem[] = JSON.parse(
      await readTextFile("Remind\\.config\\notes.json", {
        dir: BaseDirectory.Document,
      })
    );

    const extractedNotes = noteItems.filter(
      (noteItem) => noteItem.path !== currentNode
    );

    const currentNote = noteItems.find(
      (noteItem) => noteItem.path === currentNode
    );

    const renamedNote: NoteItem = {
      due_date: currentNote?.due_date!,
      efactor: currentNote?.efactor!,
      interval: currentNote?.interval!,
      references: currentNote?.references!,
      repetition: currentNote?.repetition!,
      path: `${folderPath}\\${input}.md`,
    };

    const updatedNoteItems = [...extractedNotes, renamedNote];

    await writeTextFile(
      "Remind\\.config\\notes.json",
      JSON.stringify(updatedNoteItems),
      { dir: BaseDirectory.Document }
    );

    if (beforeRename.length > 0) {
      const extractedNotes = notes.filter((note) => note.path !== currentNode);

      const note = {
        title: `${input}.md`,
        content: beforeRename[0].content,
        path: `${folderPath}\\${input}.md`,
      };

      setNotes([...extractedNotes, note]);
    }

    readFileTree();
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        componentRef.current &&
        !componentRef.current.contains(e.target as Node | null)
      ) {
        setIsError(false);
        setIsOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={componentRef}
      className="absolute top-8 p-3 border border-zinc-800 rounded-md bg-zinc-900 shadow left-0 right-0 w-full mx-auto flex flex-col z-50 gap-4"
    >
      <h4 className="text-zinc-100 font-medium text-xs text-start">{title}</h4>
      <form className="flex flex-col gap-4" onSubmit={formSubmit}>
        <div className="relative">
          <input
            onChange={(e) => setInput(e.currentTarget.value)}
            type="text"
            autoFocus={true}
            placeholder={placeholder}
            className="w-full p-1.5 rounded-md bg-zinc-900 border border-zinc-800 focus:border-zinc-600 focus:outline-none text-xs text-zinc-100"
            id="input"
          />
          {isError && (
            <span className="text-xs text-red-600 absolute -top-1.5 right-3 px-2 bg-zinc-900">
              {errorMessage}
            </span>
          )}
        </div>

        <button className="px-4 py-1.5 text-xs text-zinc-50 bg-zinc-900 rounded-md font-medium hover:bg-zinc-50 hover:text-zinc-900 border border-zinc-800 hover:border-zinc-800 z-50">
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default Popover;
