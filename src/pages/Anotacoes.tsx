import FileExplorer from "../components/FileExplorer"
import Note from "../components/Note"

const Anotacoes = () => {
  return (
    <div className="flex w-full">
      <FileExplorer />
      <Note />
    </div>
  )
}

export default Anotacoes