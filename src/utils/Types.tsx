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
}
export type AddLocation = {
  id: string;
  where: "before" | "after";
} | null;
