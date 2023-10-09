import { Popover } from "@headlessui/react";
import { FC, useEffect, useState } from "react";
import { PiTagSimpleLight } from "react-icons/pi";
import { MdOutlineCollectionsBookmark } from "react-icons/md";
import { Card, NoteItem } from "../lib/types";
import { readTextFile, BaseDirectory, writeTextFile } from "@tauri-apps/api/fs";
import SelectTags from "./SelectTags";
import { BsX } from "react-icons/bs";
import SelectCards from "./SelectCards";
import CardItem from "./CardItem";

interface NoteOptionsProps {
  path: string;
}

const NoteOptions: FC<NoteOptionsProps> = ({ path }) => {
  const [note, setNote] = useState<NoteItem>();
  const [cards, setCards] = useState<Card[]>([
    { name: "Selecionar coleção...", notes: [] },
  ]);
  const [currentCard, setCurrentCard] = useState<Card>({
    name: "Selecionar coleção...",
    notes: [],
  });
  const [tags, setTags] = useState<string[]>(["Adicionar tag"]);

  const loadNote = async () => {
    const noteItems: NoteItem[] = JSON.parse(
      await readTextFile("Remind\\.config\\notes.json", {
        dir: BaseDirectory.Document,
      })
    );

    const note = noteItems.find((noteItem) => noteItem.path === path);
    setNote(note);
  };

  const loadCards = async () => {
    const loadCards: Card[] = JSON.parse(
      await readTextFile("Remind\\.config\\cards.json", {
        dir: BaseDirectory.Document,
      })
    );

    loadCards.forEach((card) => {
      if (card.notes.some((noteItem) => noteItem === path)) {
        setCurrentCard(card);
      }
    });

    setCards([...cards, ...loadCards]);
  };

  const loadTags = async () => {
    const tagItems: string[] = JSON.parse(
      await readTextFile("Remind\\.config\\tags.json", {
        dir: BaseDirectory.Document,
      })
    );

    setTags([...tags, ...tagItems]);
  };

  const addTag = async (tag: string) => {
    const notes: NoteItem[] = JSON.parse(
      await readTextFile("Remind\\.config\\notes.json", {
        dir: BaseDirectory.Document,
      })
    );

    const extractedNotes = notes.filter(
      (noteItem) => noteItem.path !== note?.path
    );

    const updatedNote = notes.find((noteItem) => noteItem.path === path);
    if (!updatedNote?.tags.some((tagItem) => tagItem === tag)) {
      updatedNote?.tags.push(tag);
    }

    const updatedNotes = [...extractedNotes, updatedNote];
    setNote(note);
    await writeTextFile(
      "Remind\\.config\\notes.json",
      JSON.stringify(updatedNotes),
      { dir: BaseDirectory.Document }
    ).then(() => {
      setNote(updatedNote);
    });
  };

  const changeCard = async (card: Card) => {
    const cards: Card[] = JSON.parse(
      await readTextFile("Remind\\.config\\cards.json", {
        dir: BaseDirectory.Document,
      })
    );

    card.notes.push(path);

    let extractedCards = cards;

    if (currentCard.notes.some((noteItem) => noteItem === path)) {
      extractedCards = cards.filter(
        (CardItem) => CardItem.name !== currentCard.name
      );
      const oldCard = cards.find(
        (cardItem) => cardItem.name === currentCard.name
      )!;
      const notes = oldCard.notes.filter((notePath) => notePath !== path);
      oldCard.notes = notes;

      const updatedCards = [...extractedCards, oldCard];

      await writeTextFile(
        "Remind\\.config\\cards.json",
        JSON.stringify(updatedCards),
        { dir: BaseDirectory.Document }
      );
    }

    extractedCards = cards.filter((cardItem) => cardItem.name !== card.name);

    const updatedCards = [...extractedCards, card];

    await writeTextFile(
      "Remind\\.config\\cards.json",
      JSON.stringify(updatedCards),
      { dir: BaseDirectory.Document }
    );
  };

  const removeTag = async (tag: string) => {
    const notes: NoteItem[] = JSON.parse(
      await readTextFile("Remind\\.config\\notes.json", {
        dir: BaseDirectory.Document,
      })
    );

    const extractedNotes = notes.filter(
      (noteItem) => noteItem.path !== note?.path
    );

    const selectedNote = notes.find((noteItem) => noteItem.path === path)!;
    const tags = selectedNote?.tags.filter((tagItem) => tagItem !== tag);
    selectedNote.tags = tags;

    const updatedNotes = [...extractedNotes, selectedNote];

    await writeTextFile(
      "Remind\\.config\\notes.json",
      JSON.stringify(updatedNotes),
      { dir: BaseDirectory.Document }
    ).then(() => {
      setNote(selectedNote);
    });
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
          {note?.tags.map((tag) => (
            <div className="flex items-center justify-between hover:bg-zinc-700 p-1 rounded">
              <p className="text-zinc-200 text-xs my-1">{tag}</p>
              <button onClick={() => removeTag(tag)}>
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
          {note?.tags.map((tag) => (
            <div className="flex items-center justify-between hover:bg-zinc-700 p-1 rounded">
              <p className="text-zinc-200 text-xs my-1">{tag}</p>
              <button onClick={() => removeTag(tag)}>
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
