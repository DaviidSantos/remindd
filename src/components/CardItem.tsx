import { FC, useEffect, useState } from "react";
import { Card, Note } from "../lib/types";
import { invoke } from "@tauri-apps/api";
import { Link } from "react-router-dom";

interface CardItemProps {
  card: Card;
}

const CardItem: FC<CardItemProps> = ({ card }) => {
  const [noteItems, setNoteItems] = useState<Note[]>([]);

  const loadNotes = async () => {
    const notes = await invoke<Note[]>("get_card_notes", { cardId: card.id });
    setNoteItems(notes)
  };

  useEffect(() => {
    loadNotes();
  }, []);

  return (
    <div className="relative flex max-w-[250px] flex-col rounded-xl bg-zinc-900 border border-zinc-800 bg-clip-border shadow-md">
      <div className="p-3">
        <div className="border-b border-b-zinc-800 mb-4">
          <h5 className="mb-1 block text-xl font-bold text-white antialiased">
            {card.name}
          </h5>
        </div>

        <div className="flex justify-between text-zinc-300 my-2">
          <p className="text-xs">Revendo:</p>
          <span className="text-xs">
            {noteItems.filter((note) => note.repetition !== 0).length} anotações
          </span>
        </div>

        <div className="flex justify-between text-zinc-300 my-2">
          <p className="text-xs">Novas:</p>
          <span className="text-xs">
            {noteItems.filter((note) => note.repetition === 0).length} anotações
          </span>
        </div>

        <Link to={`/revisao/${card.id}`} className="w-full block text-center px-4 py-1.5 text-xs text-zinc-900 bg-zinc-50 rounded-md font-medium hover:bg-zinc-900 hover:text-zinc-50 border border-zinc-800 hover:border-zinc-800 z-50 mt-3">
          Revisar
        </Link>
      </div>
    </div>
  );
};

export default CardItem;
