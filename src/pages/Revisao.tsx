import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Note } from "../lib/types";
import { invoke } from "@tauri-apps/api";
import dompurify from "dompurify";
import { getNodeName, getPath } from "../lib/utils";
import { readTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import { marked } from "marked";
import { SuperMemoGrade, supermemo } from "supermemo";
import dayjs from "dayjs";

const Revisao = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);
  const navigate = useNavigate();
  const [showText, setShowText] = useState(false);
  const [contents, setContents] = useState<string[]>([]);
  const { card_id } = useParams();

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const notes_db = await invoke<Note[]>("get_card_notes", {
      cardId: Number(card_id),
    });
    setNotes(notes_db);

    let contents: string[] = [];

    notes_db.forEach(async (note) => {
      const content = await readTextFile(getPath(note.path), {
        dir: BaseDirectory.Document,
      });

      contents.push(content);
    });

    setContents(contents);
  };

  const revisao = async (grade: SuperMemoGrade) => {
    const note = notes[currentNoteIndex];
    const { interval, repetition, efactor } = supermemo(note, grade);
    const dueDate = dayjs(Date.now())
      .add(interval, "day")
      .toISOString()
      .substring(0, 10);
    await invoke("revisao", {
      path: note.path,
      interval,
      repetition,
      efactor,
      dueDate,
    });

    if (notes.length - 1 === currentNoteIndex) {
      navigate("/repeticao");
    } else {
      setShowText(false);
      setCurrentNoteIndex(currentNoteIndex + 1);
    }
  };

  return (
    <div className="w-full bg-zinc-900 flex justify-center items-center">
      <div className="w-6/7 flex flex-col justify-center">
        <p className="text-zinc-200 text-3xl font-bold text-center my-10">
          {notes[currentNoteIndex] &&
            getNodeName(notes[currentNoteIndex].path.replace(/\.md$/, ""))}
        </p>
        {showText && contents[currentNoteIndex] && (
          <div
            className="prose prose-sm prose-invert mx-auto prose-h1:w-[700px] max-w-[700px] w-[700px] break-words"
            dangerouslySetInnerHTML={{
              __html: dompurify.sanitize(
                marked.parse(contents[currentNoteIndex])
              ),
            }}
          />
        )}
        {showText || (
          <button
            className="my-10 px-4 py-1.5 text-xs text-zinc-900 bg-zinc-50 rounded-md font-medium hover:bg-zinc-900 hover:text-zinc-50 border border-zinc-800 hover:border-zinc-800 z-50"
            onClick={() => setShowText(!showText)}
          >
            Mostrar resposta
          </button>
        )}
        {showText && (
          <div className="flex w-full justify-between">
            <button
              className="my-10 px-4 py-1.5 min-w-[200px] text-xs text-zinc-900 bg-zinc-50 rounded-md font-medium hover:bg-zinc-900 hover:text-zinc-50 border border-zinc-800 hover:border-zinc-800 z-50"
              onClick={() => revisao(5)}
            >
              Fácil
            </button>
            <button
              className="my-10 px-4 py-1.5 text-xs min-w-[200px] text-zinc-900 bg-zinc-50 rounded-md font-medium hover:bg-zinc-900 hover:text-zinc-50 border border-zinc-800 hover:border-zinc-800 z-50"
              onClick={() => revisao(3)}
            >
              Médio
            </button>
            <button
              className="my-10 px-4 py-1.5 text-xs min-w-[200px] text-zinc-900 bg-zinc-50 rounded-md font-medium hover:bg-zinc-900 hover:text-zinc-50 border border-zinc-800 hover:border-zinc-800 z-50"
              onClick={() => revisao(1)}
            >
              Difícil
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Revisao;
