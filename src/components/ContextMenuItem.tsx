import { FC } from "react";
import { IconType } from "react-icons";
import { useFileTreeContext } from "../context/FileTreeContext";
import { useNotesContext } from "../context/NotesContext";

type AsyncFunction = (path: string) => Promise<void>;
type VoidFunction = () => void;

interface ContextMenuItemProps {
  icon: IconType;
  description: string;
  path: string;
  action: AsyncFunction | VoidFunction
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
