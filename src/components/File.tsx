import { FC, useState } from "react";
import { deleteFile, getNodeName, getPath, renameNote } from "../lib/utils";
import { useFileTreeContext } from "../context/FileTreeContext";
import ContextMenu from "./ContextMenu";
import ContextMenuItem from "./ContextMenuItem";
import { PiTrashLight } from "react-icons/pi";
import { GoPencil } from "react-icons/go";
import { useNotesContext } from "../context/NotesContext";
import { readTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import Popover from "./Popover";

interface FileProps {
  path: string;
}

const File: FC<FileProps> = ({ path }) => {
  const { currentNode, setCurrentNode } = useFileTreeContext();
  const [isError, setIsError] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
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
    <div className="relative">
      <ContextMenu
        path={path}
        isOpen={isContextMenuOpen}
        setIsOpen={setIsContextMenuOpen}
      >
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
          actionType="delete"
        />
        <ContextMenuItem
          icon={GoPencil}
          description="Renomear anotação"
          action={() => {
            setIsRenameOpen(true);
            setIsContextMenuOpen(false);
          }}
          path={path}
          actionType="rename"
        />
      </ContextMenu>

      {isRenameOpen && (
        <Popover
          title="Renomear anotação"
          action={renameNote}
          buttonText="Renomear"
          errorMessage="Titulo já existe"
          placeholder="Novo título"
          actionType="renomear"
          isError={isError}
          setIsError={setIsError}
          setIsOpen={setIsRenameOpen}
        />
      )}
    </div>
  );
};
export default File;
