import { HiOutlineFolderPlus } from "react-icons/hi2";
import { FileTreeContextProvider } from "../context/FileTreeContext";
import { createFolder, createNote } from "../lib/utils";
import Action from "./Action";
import FileTree from "./FileTree";
import { PiNotePencil, PiTagThin } from "react-icons/pi";
import { useExplorerContext } from "../context/ExplorerContext";
import { useState } from "react";
import Tags from "./Tags";

const FileExplorer = () => {
  const [viewType, setViewType] = useState("file_tree");
  const { isExplorerOpen } = useExplorerContext();

  return (
    isExplorerOpen && (
      <FileTreeContextProvider>
        <section className="h-full w-[300px] bg-black/75 border-x border-x-zinc-800">
          <div className="flex justify-between items-center py-2 px-6 border-b border-b-zinc-800 rounded-lg relative">
            <button
              className="p-1 hover:bg-zinc-700 rounded-full text-zinc-100"
              onClick={() => setViewType("tags")}
            >
              <PiTagThin className="h-4" />
            </button>
            <Action
              icon={PiNotePencil}
              title="Nova anotação"
              buttonText="Criar anotação"
              errorMessage="Anotação já existe"
              placeholder="Titulo da anotação"
              action={createNote}
              actionType="note"
            />
            <Action
              icon={HiOutlineFolderPlus}
              title="Nova pasta"
              buttonText="Criar pasta"
              errorMessage="Pasta já existe"
              placeholder="Nome da pasta"
              action={createFolder}
              actionType="folder"
            />
          </div>
          {viewType === "file_tree" ? (
            <FileTree />
          ) : (
            <Tags setViewType={setViewType} />
          )}
        </section>
      </FileTreeContextProvider>
    )
  );
};

export default FileExplorer;
