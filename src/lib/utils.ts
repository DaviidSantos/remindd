import { invoke } from "@tauri-apps/api";
import {
  writeTextFile,
  BaseDirectory,
  createDir,
  removeFile,
  removeDir,
  readTextFile,
  renameFile,
} from "@tauri-apps/api/fs";

export const getNodeName = (filePath: string) => {
  if (!filePath) {
    return "";
  }

  const parts = filePath.split("\\");
  const lastPart = parts[parts.length - 1];
  return lastPart;
};

export const getPath = (path: string) => {
  const remindSubstring = "Documents\\";
  const index = path.indexOf(remindSubstring);

  if (index !== -1) {
    return path.substring(index + remindSubstring.length);
  } else {
    return "";
  }
};

export const extractFolderPath = (input: string): string => {
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
  currentNode?: string
) => {
  const filePath = extractFolderPath(currentNode!);
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
  currentNode?: string
) => {
  const filePath = extractFolderPath(currentNode!);
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

export const deleteFile = async (path?: string) => {
  await removeFile(getPath(path!), {
    dir: BaseDirectory.Document,
  });
};

export const deleteFolder = async (path: string) => {
  await removeDir(getPath(path), {
    dir: BaseDirectory.Document,
    recursive: true,
  });
};

export const createTag = async (
  setIsOpen: (isOpen: boolean) => void,
  setIsError: (isError: boolean) => void,
  name: string | undefined
) => {
  try {
    const tags: string[] = JSON.parse(
      await readTextFile("Remind\\.config\\tags.json", {
        dir: BaseDirectory.Document,
      })
    );

    if (tags.some((tag) => tag === name)) {
      throw new Error();
    }

    tags.push(name!);

    await writeTextFile("Remind\\.config\\tags.json", JSON.stringify(tags), {
      dir: BaseDirectory.Document,
    })
      .then(() => {
        setIsOpen(false);
      })
      .catch(() => {
        setIsError(true);
      });
  } catch (e) {
    setIsError(true);
  }
};

export const renameNote = async (
  setIsOpen: (isOpen: boolean) => void,
  setIsError: (isError: boolean) => void,
  title: string | undefined,
  currentNode?: string
) => {
  const folderPath = extractFolderPath(currentNode!);
  const path = getPath(folderPath) + `\\${title}.md`;
  await renameFile(`${getPath(currentNode!)}`, `${path}`, {
    dir: BaseDirectory.Document,
  })
    .then(async () => {
      await invoke("update_note_path", {path: currentNode, newPath: `${folderPath}\\${title}.md`});
      setIsOpen(false);

      setIsError(false);
    })
    .catch(() => {
      setIsError(true);
    });
};
