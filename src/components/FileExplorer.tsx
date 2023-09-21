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
        <section className="h-full w-[300px] bg-white/95">
          <div className="flex justify-between items-center py-2 px-6 border-b rounded-lg relative">
            <button
              className="p-1 hover:bg-zinc-300 rounded-full"
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
            />
            <Action
              icon={HiOutlineFolderPlus}
              title="Nova pasta"
              buttonText="Criar pasta"
              errorMessage="Pasta já existe"
              placeholder="Nome da pasta"
              action={createFolder}
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
