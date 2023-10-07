import { FC, useEffect, useState } from "react";
import { Card, NoteItem } from "../lib/types";
import { readTextFile, BaseDirectory } from "@tauri-apps/api/fs";

interface CardItemProps {
  card: Card;
}

const CardItem: FC<CardItemProps> = ({ card }) => {
  const [noteItems, setNoteItems] = useState<NoteItem[]>([]);

  const loadNotes = async () => {
    const notes: NoteItem[] = [];

    const noteItems: NoteItem[] = JSON.parse(
      await readTextFile("Remind\\.config\\notes.json", {
        dir: BaseDirectory.Document,
      })
    );

    card.notes.forEach((note) => {
      const noteItem = noteItems.find((noteItem) => noteItem.path === note);

      if (noteItem) {
        notes.push(noteItem);
      }
    });

    setNoteItems(notes);
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

        <button className="w-full px-4 py-1.5 text-xs text-zinc-900 bg-zinc-50 rounded-md font-medium hover:bg-zinc-900 hover:text-zinc-50 border border-zinc-800 hover:border-zinc-800 z-50 mt-3">
          Revisar
        </button>
      </div>
    </div>
  );
};

export default CardItem;
