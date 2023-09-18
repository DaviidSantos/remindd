import { FileTreeContextProvider } from "../context/FileTreeContext"
import FileTree from "./FileTree"

const FileExplorer = () => {
  return (
    <FileTreeContextProvider>
        <section className="h-full w-[300px] bg-white/95">
            <FileTree />
        </section>
    </FileTreeContextProvider>
  )
}

export default FileExplorer