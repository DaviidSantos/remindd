import { FC } from "react";
import { deleteFile, getNodeName, getPath } from "../lib/utils";
import { useFileTreeContext } from "../context/FileTreeContext";
import ContextMenu from "./ContextMenu";
import ContextMenuItem from "./ContextMenuItem";
import { PiTrashLight } from "react-icons/pi";
import { useNotesContext } from "../context/NotesContext";
import { readTextFile, BaseDirectory } from "@tauri-apps/api/fs";

interface FileProps {
  path: string;
}

const File: FC<FileProps> = ({ path }) => {
  const { currentNode, setCurrentNode } = useFileTreeContext();
  const { notes, setNotes, setActiveNote } = useNotesContext();

  const openNote = async () => {
    if (!notes.some((note) => note.title === getNodeName(path))) {
      const openNote = {
        title: getNodeName(path),
        content: await readTextFile(getPath(path), {
          dir: BaseDirectory.Document,
        }),
        path,
      };

      const updatedNotes = [...notes, openNote];
      setNotes(updatedNotes);
      setActiveNote(updatedNotes.length - 1);
    }
  };

  return (
    <ContextMenu>
      <button
        onClick={() => setCurrentNode(path)}
        onDoubleClick={openNote}
        className={`text-xs inline-flex break-all text-left py-1 px-2 rounded-md text-zinc-100 ${
          currentNode === path ? "bg-zinc-500/30 text-zinc-100" : ""
        }`}
      >
        {getNodeName(path)}
      </button>

      <ContextMenuItem
        icon={PiTrashLight}
        description="Apagar anotação"
        action={deleteFile}
        path={path}
      />
    </ContextMenu>
  );
};
export default File;
