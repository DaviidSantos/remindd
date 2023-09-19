import { writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import { useFileTreeContext } from "../context/FileTreeContext";

export const getNodeName = (filePath: string) => {
  if (!filePath) {
    return "";
  }

  const parts = filePath.split("\\");
  const lastPart = parts[parts.length - 1];
  return lastPart;
};

const getPath = (path: string) => {
  const remindSubstring = "Documents\\";
  const index = path.indexOf(remindSubstring);

  if (index !== -1) {
    return path.substring(index + remindSubstring.length);
  } else {
    return "";
  }
};

const extractFolderPath = (input: string): string => {
  const regex = /\\[^\\]+\.md$/;

  if (regex.test(input)) {
    return (input = input.replace(regex, ""));
  }

  return input;
};

export const createNote = async (
  setIsOpen: (isOpen: boolean) => void,
  setIsError: (isError: boolean) => void
) => {
  const input = document.querySelector("#input") as HTMLInputElement;
  const title = input.value;

  const { currentNode, readFileTree } = useFileTreeContext();
  const folderPath = extractFolderPath(currentNode!);
  const path = getPath(folderPath) + `\\${title}.md`;
  await writeTextFile(`${path}`, "", {
    dir: BaseDirectory.Document,
  })
    .then(() => {
      readFileTree();
      input.value = "";
      setIsOpen(false);
    })
    .catch(() => {
      setIsError(true);
    });
};
