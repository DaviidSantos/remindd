import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { invoke } from "@tauri-apps/api/tauri";

export type TreeNode = {
  path: string;
  children: TreeNode[];
  is_folder: boolean;
};

export interface FileTreeContextType {
  fileTree: TreeNode | undefined;
  readFileTree: () => Promise<void>;
  currentNode: string | undefined;
  setCurrentNode: (node: string) => void;
}

interface FileTreeContextProviderProps {
  children: React.ReactNode;
}

export const FileTreeContext = createContext<FileTreeContextType>({
  fileTree: undefined,
  readFileTree: async () => {},
  currentNode: "",
  setCurrentNode: () => {},
});

export function useFileTreeContext() {
  const context = useContext(FileTreeContext);

  if (!context)
    throw new Error(
      `Context 'FileTreeContext' is null. Did you use <FileTreeContextProvider>?`
    );

  return context;
}

export const FileTreeContextProvider: FC<FileTreeContextProviderProps> = ({
  children,
}) => {
  const [fileTree, setFileTree] = useState<TreeNode>();
  const [currentNode, setCurrentNode] = useState<string>();

  const readFileTree = async () => {
    const data = await invoke<TreeNode>("read_file_tree");
    setCurrentNode(data.path);
    setFileTree(data);
  };

  useEffect(() => {
    readFileTree();
  }, []);

  return (
    <FileTreeContext.Provider
      value={{
        fileTree,
        readFileTree,
        currentNode,
        setCurrentNode,
      }}
    >
      {children}
    </FileTreeContext.Provider>
  );
};
