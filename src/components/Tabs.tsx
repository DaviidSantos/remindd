import { Tab } from "@headlessui/react";
import { useNotesContext } from "../context/NotesContext";
import { HiX } from "react-icons/hi";
import { useState } from "react";
import Note from "./Note";

const Tabs = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { notes, setNotes } = useNotesContext();

  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  };

  const closeTab = (title: string) => {
    const updatedNotes = notes.filter((note) => note.title !== title);

    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
    setNotes(updatedNotes);
  };

  return (
    <div className="w-full h-full bg-zinc-50">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="w-full flex">
          {notes.map((note) => (
            <Tab
              key={note.path}
              className={({ selected }) =>
                classNames(
                  "px-3 p-1 text-sm flex items-center gap-2 bg-zinc-100",
                  selected ? "bg-zinc-50 text-zinc-800 focus:outline-none" : ""
                )
              }
            >
              <span>{note.title}</span>{" "}
              <button onClick={() => closeTab(note.title)}>
                <HiX className="h-4 text-zinc-700" />
              </button>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {notes.map((note) => (
            <Tab.Panel key={`${note.path}${note.title}`}>
              <Note note={note} />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Tabs;
