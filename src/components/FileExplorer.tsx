import { FileTreeContextProvider } from "../context/FileTreeContext"
import FileTree from "./FileTree"

const FileExplorer = () => {
  return (
    <FileTreeContextProvider>
        <section className="h-full w-[300px] bg-white/75">
            <FileTree />
        </section>
    </FileTreeContextProvider>
  )
}

export default FileExplorer