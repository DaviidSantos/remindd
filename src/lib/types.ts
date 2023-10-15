import { SuperMemoItem } from "supermemo";

export interface NoteItem extends SuperMemoItem {
  due_date: string;
  path: string;
  references: string[];
  tags: string[];
}

export interface Card {
  id: number;
  name: string;
}

export interface Note {
  id: number;
  path: string;
  due_date: string;
  interval: number;
  repetition: number;
  efactor: number;
  card_id?: number;
}

export interface Tag {
  id: number;
  name: string
}
