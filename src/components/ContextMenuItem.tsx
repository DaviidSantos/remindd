import { FC } from "react";
import { IconType } from "react-icons";
import { useFileTreeContext } from "../context/FileTreeContext";
import { useNotesContext } from "../context/NotesContext";

interface ContextMenuItemProps {
  icon: IconType;
  description: string;
  path: string;
  action: (path: string) => Promise<void>;
}

const ContextMenuItem: FC<ContextMenuItemProps> = ({
  icon: Icon,
  description,
  path,
  action,
}) => {
  const { readFileTree } = useFileTreeContext();
  const { notes, setNotes, activeNote, setActiveNote } = useNotesContext();

  const itemClick = async () => {
    await action(path);
    const updatedNotes = notes.filter((note) => note.path !== path);
    setNotes(updatedNotes);
    if (activeNote !== 0) {
      setActiveNote(activeNote - 1);
    }
    readFileTree();
  };

  return (
    <button
      onClick={itemClick}
      className="flex items-center gap-2 rounded-md hover:bg-zinc-200 p-2 w-full"
    >
      <Icon className="h-3 text-zinc-600" />
      <span className="text-xs text-zinc-800 font-medium">{description}</span>
    </button>
  );
};

export default ContextMenuItem;
