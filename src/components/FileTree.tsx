import { useFileTreeContext } from "../context/FileTreeContext";
import { getNodeName } from "../lib/utils";
import Folder from "./Folder";
import File from "./File";

const FileTree = () => {
  const { fileTree, setCurrentNode } = useFileTreeContext();

  return (
    <section className="px-5 py-3 h-3/4" onClick={() => setCurrentNode(fileTree?.path!)}>
      <div className="flex flex-col gap-3 my-1" onClick={(e) => e.stopPropagation()}>
        {fileTree?.children
          .filter((node) => getNodeName(node.path) !== ".config")
          .sort((a, b) => {
            if(a.is_folder === b.is_folder) {
              return 0
            }

            return a.is_folder ? -1 : 1;
          })
          .map((node) => (
            <>
              {node.is_folder ? (
                <Folder {...node} />
              ) : (
                <File path={node.path} />
              )}
            </>
          ))}
      </div>
    </section>
  );
};

export default FileTree;
