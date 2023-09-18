import FileExplorer from "../components/FileExplorer";
import Note from "../components/Note";

const Notes = () => {
  return (
    <div className="flex w-full">
      <FileExplorer />
      <Note />
    </div>
  );
};

export default Notes;
