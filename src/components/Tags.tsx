import { BsPlus } from "react-icons/bs";
import { AiOutlineLeft } from "react-icons/ai";
import { FC, useEffect, useState } from "react";
import Action from "./Action";
import { createTag } from "../lib/utils";
import { readTextFile, BaseDirectory } from "@tauri-apps/api/fs";

interface TagsProps {
  setViewType: (viewType: string) => void;
}

const Tags: FC<TagsProps> = ({ setViewType }) => {
  const [tags, setTags] = useState<string[]>([]);

  const readTags = async () => {
    const tags: string[] = JSON.parse(
      await readTextFile("Remind\\.config\\tags.json", {
        dir: BaseDirectory.Document,
      })
    );

    setTags(tags);
  };

  useEffect(() => {
    readTags();
  });

  return (
    <section className="px-5 py-3 h-3/4 relative">
      <div className="flex justify-between border-b border-b-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <button onClick={() => setViewType("file_tree")}>
            <AiOutlineLeft className="h-3 text-zinc-100" />
          </button>
          <h4 className="text-sm font-semibold text-zinc-100">Tags</h4>
        </div>
        <button>
          <Action
            icon={BsPlus}
            title="Nova tag"
            buttonText="Criar tag"
            errorMessage="Erro ao criar tag"
            placeholder="Nome da tag"
            action={createTag}
          />
        </button>
      </div>
      
      <ul className="flex flex-col gap-3 px-2 my-4">
        {tags.map((tag) => (
          <li className="text-sm text-zinc-300 p-1 rounded-md hover:bg-zinc-800/75">{tag}</li>
        ))}
      </ul>
    </section>
  );
};

export default Tags;
