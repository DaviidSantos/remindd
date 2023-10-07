import { SuperMemoItem } from "supermemo";

export interface NoteItem extends SuperMemoItem {
  due_date: string;
  path: string;
  references: string[];
}

export interface Card {
  name: string;
  notes: string[];
}
