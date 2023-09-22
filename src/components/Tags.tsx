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
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setViewType("file_tree")}>
            <AiOutlineLeft className="h-3 text-zinc-600" />
          </button>
          <h4 className="text-sm font-semibold text-zinc-800">Tags</h4>
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
      <hr />
      <ul className="flex flex-col gap-3 px-2 my-4">
        {tags.map((tag) => (
          <li className="text-sm text-zinc-800">{tag}</li>
        ))}
      </ul>
    </section>
  );
};

export default Tags;
