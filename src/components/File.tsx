import { FC } from "react";
import { getNodeName } from "../lib/utils";
import { useFileTreeContext } from "../context/FileTreeContext";
import ContextMenu from "./ContextMenu";
import ContextMenuItem from "./ContextMenuItem";
import { PiTrashLight } from "react-icons/pi";

interface FileProps {
  path: string;
}

const File: FC<FileProps> = ({ path }) => {
  const { currentNode, setCurrentNode } = useFileTreeContext();

  return (
    <ContextMenu>
      <button
        onClick={() => setCurrentNode(path)}
        className={`text-sm inline-flex break-all text-left py-1 px-2 rounded-md text-zinc-800 ${
          currentNode === path ? "bg-zinc-500/30 text-zinc-300" : ""
        }`}
      >
        {getNodeName(path)}
      </button>

      <ContextMenuItem
        icon={PiTrashLight}
        description="Apagar anotação"
        action={() => {}}
        path={path}
      />
    </ContextMenu>
  );
};
export default File;
