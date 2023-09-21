import { BsPlus } from "react-icons/bs";
import { AiOutlineLeft } from "react-icons/ai";
import { FC } from "react";

interface TagsProps {
  setViewType: (viewType: string) => void;
}

const Tags: FC<TagsProps> = ({ setViewType }) => {
  return (
    <section className="px-5 py-3 h-3/4">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setViewType('file_tree')}>
            <AiOutlineLeft className="h-3 text-zinc-600" />
          </button>
          <h4 className="text-sm font-semibold text-zinc-800">Tags</h4>
        </div>
        <button>
          <BsPlus className="h4 text-zinc-600" />
        </button>
      </div>
    </section>
  );
};

export default Tags;
