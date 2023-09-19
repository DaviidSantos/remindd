import { writeTextFile, BaseDirectory, createDir } from "@tauri-apps/api/fs";

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
  setIsError: (isError: boolean) => void,
  title: string | undefined,
  currentNode: string
) => {
  const filePath = extractFolderPath(currentNode);
  const path = getPath(filePath) + `\\${title}.md`;
  await writeTextFile(`${path}`, "", {
    dir: BaseDirectory.Document,
  })
    .then(() => {
      setIsOpen(false);
    })
    .catch(() => {
      setIsError(true);
    });
};

export const createFolder = async (
  setIsOpen: (isOpen: boolean) => void,
  setIsError: (isError: boolean) => void,
  name: string | undefined,
  currentNode: string
) => {
  const filePath = extractFolderPath(currentNode);
  const path = getPath(filePath) + `\\${name}`;
  await createDir(path, {
    dir: BaseDirectory.Document,
  })
    .then(() => {
      setIsOpen(false);
    })
    .catch(() => {
      setIsError(true);
    });
};
