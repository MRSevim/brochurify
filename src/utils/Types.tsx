export interface Props {
  text?: string;
  style?: Style;
  child?: Layout[];
  src?: string;
  width?: number;
  height?: number;
  children?: React.ReactNode;
  [key: string]:
    | string
    | number
    | Style
    | Layout[]
    | React.ReactNode
    | undefined;
}
export interface Layout {
  id: string;
  type: string;
  props: Props;
}
export interface EditorState {
  active?: LayoutOrUnd;
  layout: Layout[];
  pageWise: PageWise;
  addLocation: AddLocation;
  dropHandled: boolean;
  draggedItem?: string;
}
export type AddLocation = {
  id: string;
  where: Where;
} | null;

export type PageWise = {
  padding?: string;
  margin?: string;
  border?: string;
  [key: string]: string | undefined;
};

export type Style = {
  padding?: string;
  margin?: string;
  border?: string;
  [key: string]: string | undefined;
};
export type LayoutOrUnd = Layout | undefined;
export type Where = "before" | "after";
export type ItemAndLocation = { item: LayoutOrUnd; addLocation: AddLocation };
export type SizingType = {
  title: string;
};
