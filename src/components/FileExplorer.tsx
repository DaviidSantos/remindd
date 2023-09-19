import { FileTreeContextProvider } from "../context/FileTreeContext";
import { createNote } from "../lib/utils";
import Action from "./Action";
import FileTree from "./FileTree";
import { PiNotePencil } from "react-icons/pi";

const FileExplorer = () => {
  return (
    <FileTreeContextProvider>
      <section className="h-full w-[300px] bg-white/95">
        <div className="flex justify-between py-2 px-6 border-b rounded-lg relative">
          <Action
            icon={PiNotePencil}
            title="Nova anotação"
            buttonText="Criar anotação"
            errorMessage=""
            placeholder="Titulo da anotação"
            action={createNote}
          />
        </div>
        <FileTree />
      </section>
    </FileTreeContextProvider>
  );
};

export default FileExplorer;
