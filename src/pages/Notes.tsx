import FileExplorer from "../components/FileExplorer";
import Note from "../components/Note";
import { FileTreeContextProvider } from "../context/FileTreeContext";

const Notes = () => {
  return (
    <div className="flex w-full">
      <FileTreeContextProvider>
        <FileExplorer />
      </FileTreeContextProvider>
      <Note />
    </div>
  );
};

export default Notes;
