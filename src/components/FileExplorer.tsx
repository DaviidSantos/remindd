import { HiOutlineFolderPlus } from "react-icons/hi2";
import { FileTreeContextProvider } from "../context/FileTreeContext";
import { createFolder, createNote } from "../lib/utils";
import Action from "./Action";
import FileTree from "./FileTree";
import { PiNotePencil } from "react-icons/pi";
import { useExplorerContext } from "../context/ExplorerContext";

const FileExplorer = () => {
  const { isExplorerOpen } = useExplorerContext();

  return (
    isExplorerOpen && (
      <FileTreeContextProvider>
        <section className="h-full w-[300px] bg-white/95">
          <div className="flex justify-between py-2 px-6 border-b rounded-lg relative">
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
          <FileTree />
        </section>
      </FileTreeContextProvider>
    )
  );
};

export default FileExplorer;
