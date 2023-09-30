import { Tab } from "@headlessui/react";
import { useNotesContext } from "../context/NotesContext";
import { HiX } from "react-icons/hi";
import Note from "./Note";

const Tabs = () => {
  const { notes, setNotes, activeNote, setActiveNote } = useNotesContext();

  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  };

  const closeTab = (title: string) => {
    const updatedNotes = notes.filter((note) => note.title !== title);

    if (activeNote > 0) {
      setActiveNote(activeNote - 1);
    }
    
    setNotes(updatedNotes);
  };

  return (
    <div className="w-full h-full bg-zinc-900">
      <Tab.Group selectedIndex={activeNote} onChange={setActiveNote}>
        <Tab.List className="w-full flex">
          {notes.map((note) => (
            <Tab
              key={note.path}
              className={({ selected }) =>
                classNames(
                  "px-3 p-1 text-sm flex items-center gap-2",
                  selected ? "bg-zinc-900 focus:outline-none" : "bg-zinc-800"
                )
              }
            >
              <span className="text-zinc-100">{note.title.replace(/\.md$/, "")}</span>
              <button onClick={() => closeTab(note.title)}>
                <HiX className="h-4 text-zinc-100" />
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
