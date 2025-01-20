import { DragEvent } from "react";

export interface Props {
  text?: string;
  child?: Layout[];
  children?: React.ReactNode;
}
export interface Layout {
  id: string;
  type: string;
  props: Props;
}
export interface EditorState {
  active?: string;
  layout?: Layout[];
  addLocation: AddLocation;
  dropHandled: boolean;
  draggedItem?: string;
}
export type AddLocation = {
  id: string;
  where: Where;
} | null;

export type Where = "before" | "after";
