import { FC } from "react";
import { getNodeName } from "../lib/utils";
import { useFileTreeContext } from "../context/FileTreeContext";

interface FileProps {
  path: string;
}

const File: FC<FileProps> = ({ path }) => {
  const { currentNode, setCurrentNode } = useFileTreeContext();

  const selectNode = () => {
    setCurrentNode(path);
  };
  return (
    <button
      onClick={selectNode}
      className={`text-sm inline-flex break-all text-left py-1 px-2 rounded-md text-zinc-800 ${
        currentNode === path ? "bg-zinc-500/30 text-zinc-300" : ""
      }`}
    >
      {getNodeName(path)}
    </button>
  );
};
export default File;
