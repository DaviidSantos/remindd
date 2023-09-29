import FileExplorer from "../components/FileExplorer";
import Tabs from "../components/Tabs";
import { FileTreeContextProvider } from "../context/FileTreeContext";
import { useNotesContext } from "../context/NotesContext";

const Notes = () => {
  const { notes, setNotes } = useNotesContext();

  return (
    <div className="flex w-full">
      <FileTreeContextProvider>
        <FileExplorer />
      </FileTreeContextProvider>
      {notes.length > 0 ? (
        <Tabs />
      ) : (
        <div className="w-full h-full bg-zinc-900 flex justify-center items-center">
          <h3 className="text-2xl text-zinc-700 font-black">
            Crie ou abra uma anotação!
          </h3>
        </div>
      )}
    </div>
  );
};

export default Notes;
