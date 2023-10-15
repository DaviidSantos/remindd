import { Popover } from "@headlessui/react";
import { FC, useEffect, useState } from "react";
import { PiTagSimpleLight } from "react-icons/pi";
import { MdOutlineCollectionsBookmark } from "react-icons/md";
import { Card, Note, NoteItem, Tag } from "../lib/types";
import { readTextFile, BaseDirectory, writeTextFile } from "@tauri-apps/api/fs";
import SelectTags from "./SelectTags";
import { BsX } from "react-icons/bs";
import SelectCards from "./SelectCards";
import { invoke } from "@tauri-apps/api";

interface NoteOptionsProps {
  path: string;
}

const NoteOptions: FC<NoteOptionsProps> = ({ path }) => {
  const [note, setNote] = useState<Note>();
  const [cards, setCards] = useState<Card[]>([
    { id: 0, name: "Selecionar coleção..." },
  ]);
  const [currentCard, setCurrentCard] = useState<Card>();
  const [noteTags, setNoteTags] = useState<Tag[]>([]);
  const [tags, setTags] = useState<Tag[]>([{ id: 0, name: "Adicionar tag" }]);

  const loadNote = async () => {
    const note: Note = await invoke<Note>("select_note", { path });

    if (note.card_id) {
      const card = await invoke<Card>("select_card", { id: note.card_id });
      setCurrentCard(card);
    } else {
      setCurrentCard({ id: 0, name: "Selecionar coleção..." });
    }

    const noteTags = await invoke<Tag[]>("get_note_tags", { id: note.id });
    setNoteTags(noteTags);
    setNote(note);
  };

  const loadCards = async () => {
    const cards_db: Card[] = await invoke<Card[]>("select_all_cards");
    setCards([...cards, ...cards_db]);
  };

  const loadTags = async () => {
    const tags_db: Tag[] = await invoke<Tag[]>("select_all_tags");
    setTags([...tags, ...tags_db]);
  };

  const addTag = async (tag: Tag) => {
    await invoke("add_note_tag", { noteId: note?.id, tagId: tag.id });
    const noteTags = await invoke<Tag[]>("get_note_tags", { id: note?.id });
    setNoteTags(noteTags);
  };

  const changeCard = async (card: Card) => {
    await invoke("update_note_card", { path, cardId: card.id });
    setCurrentCard(card);
  };

  const removeTag = async (id: number) => {
    await invoke("delete_note_tag", { noteId: note?.id, tagId: id });
    const updatedTags = noteTags.filter((tag) => tag.id !== id);
    setNoteTags(updatedTags);
  };

  useEffect(() => {
    loadNote();
    loadTags();
    loadCards();
  }, []);

  return (
    <div className="my-4 flex items-center gap-6">
      <Popover className="relative">
        <Popover.Button className="flex items-center gap-2 group">
          <PiTagSimpleLight className="h-4 text-zinc-200 group-hover:text-zinc-400" />
          <span className="text-xs text-zinc-200 group-hover:text-zinc-400">
            Tags
          </span>
        </Popover.Button>

        <Popover.Panel className="absolute z-10 bg-zinc-900 border border-zinc-800 rounded-md shadow px-4 py-2 mt-2">
          <SelectTags options={tags} action={addTag} />
          {noteTags.map((tag) => (
            <div className="flex items-center justify-between hover:bg-zinc-700 p-1 rounded">
              <p className="text-zinc-200 text-xs my-1">{tag.name}</p>
              <button onClick={() => removeTag(tag.id)}>
                <BsX className="text-zinc-200 h-4" />
              </button>
            </div>
          ))}
        </Popover.Panel>
      </Popover>

      <Popover className="relative">
        <Popover.Button className="flex items-center gap-2 group">
          <MdOutlineCollectionsBookmark className="h-4 text-zinc-200 group-hover:text-zinc-400" />
          <span className="text-xs text-zinc-200 group-hover:text-zinc-400">
            Coleção
          </span>
        </Popover.Button>

        <Popover.Panel className="absolute z-10 bg-zinc-900 border border-zinc-800 rounded-md shadow px-4 py-2 mt-2">
          <SelectCards
            options={cards}
            action={changeCard}
            currentCard={currentCard!}
          />
          {noteTags.map((tag) => (
            <div className="flex items-center justify-between hover:bg-zinc-700 p-1 rounded">
              <p className="text-zinc-200 text-xs my-1">{tag.name}</p>
              <button onClick={() => removeTag(tag.id)}>
                <BsX className="text-zinc-200 h-4" />
              </button>
            </div>
          ))}
        </Popover.Panel>
      </Popover>
    </div>
  );
};

export default NoteOptions;
