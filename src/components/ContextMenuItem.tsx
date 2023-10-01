import { FC } from "react";
import { IconType } from "react-icons";
import { useFileTreeContext } from "../context/FileTreeContext";
import { useNotesContext } from "../context/NotesContext";
import { readTextFile, BaseDirectory, writeTextFile } from "@tauri-apps/api/fs";
import { NoteItem } from "../lib/types";

type AsyncFunction = (path: string) => Promise<void>;
type VoidFunction = () => void;

interface ContextMenuItemProps {
  icon: IconType;
  description: string;
  path: string;
  action: AsyncFunction | VoidFunction;
  actionType: string;
}

const ContextMenuItem: FC<ContextMenuItemProps> = ({
  icon: Icon,
  description,
  path,
  action,
  actionType,
}) => {
  const { readFileTree } = useFileTreeContext();
  const { notes, setNotes, activeNote, setActiveNote } = useNotesContext();

  const itemClick = async () => {
    if (actionType === "delete") {
      await action(path);
      const updatedNotes = notes.filter((note) => note.path !== path);
      setNotes(updatedNotes);
      if (activeNote !== 0) {
        setActiveNote(activeNote - 1);
      }

      const noteItems: NoteItem[] = JSON.parse(
        await readTextFile("Remind\\.config\\notes.json", {
          dir: BaseDirectory.Document,
        })
      );

      const updatedNoteItems = noteItems.filter(
        (noteItem) => noteItem.path !== path
      );

      await writeTextFile(
        "Remind\\.config\\notes.json",
        JSON.stringify(updatedNoteItems),
        { dir: BaseDirectory.Document }
      );

      readFileTree();
    } else {
      action(path);
    }
  };

  return (
    <button
      onClick={itemClick}
      className="flex items-center gap-4 rounded-md hover:bg-zinc-800 p-2 w-full"
    >
      <Icon className="h-4 text-zinc-100" />
      <span className="text-xs text-zinc-100">{description}</span>
    </button>
  );
};

export default ContextMenuItem;
