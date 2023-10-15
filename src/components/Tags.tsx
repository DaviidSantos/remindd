import { BsPlus, BsX } from "react-icons/bs";
import { AiOutlineLeft } from "react-icons/ai";
import { FC, useEffect, useState } from "react";
import Action from "./Action";
import { createTag } from "../lib/utils";
import { Tag } from "../lib/types";
import { invoke } from "@tauri-apps/api";

interface TagsProps {
  setViewType: (viewType: string) => void;
}

const Tags: FC<TagsProps> = ({ setViewType }) => {
  const [tags, setTags] = useState<Tag[]>([]);

  const readTags = async () => {
    const tags: Tag[] = await invoke<Tag[]>("select_all_tags");
    setTags(tags);
  };

  const deleteTag = async (id: number) => {
    await invoke("delete_tag", { id });
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
            actionType="add"
          />
        </button>
      </div>

      <ul className="flex flex-col gap-3 px-2 my-4">
        {tags.map((tag) => (
          <li className="text-sm text-zinc-300 p-1 rounded-md hover:bg-zinc-800/75 flex items-center justify-between">
            <span>{tag.name}</span>
            <button onClick={() => deleteTag(tag.id)}>
              <BsX className="text-zinc-200 h-4" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Tags;
