export interface Props {
  text?: string;
  style?: Style;
  child?: Layout[];
  children?: React.ReactNode;
}
export interface Layout {
  id: string;
  type: string;
  props: Props;
}
export interface EditorState {
  active?: LayoutOrUnd;
  layout: Layout[];
  addLocation: AddLocation;
  dropHandled: boolean;
  draggedItem?: string;
}
export type AddLocation = {
  id: string;
  where: Where;
} | null;

export type Style = {
  padding?: string;
  paddingRight?: string;
  paddingLeft?: string;
  paddingTop?: string;
  paddingBottom?: string;
  margin?: string;
  marginRight?: string;
  marginLeft?: string;
  marginTop?: string;
  marginBottom?: string;
  backgroundColor?: string;
  [key: string]: string | undefined;
};
export type LayoutOrUnd = Layout | undefined;
export type Where = "before" | "after";
export type ItemAndLocation = { item: LayoutOrUnd; addLocation: AddLocation };
export type SizingType = {
  type: string;
  title: string;
};
