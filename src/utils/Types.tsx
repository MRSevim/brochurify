import { ChangeEvent } from "react";

export interface Props {
  text?: string;
  style: Style;
  child?: Layout[];
  src?: string;
  href?: string;
  newTab?: boolean;
  alt?: string;
  iconType?: String;
  children?: React.ReactNode;
  [key: string]:
    | string
    | boolean
    | Style
    | Layout[]
    | React.ReactNode
    | undefined;
}
export interface PropsWithId extends Props {
  id: string;
}
export interface Layout {
  id: string;
  type: string;
  props: Props;
}
export interface EditorState {
  active?: LayoutOrUnd;
  history: History;
  layout: Layout[];
  pageWise: PageWise;
  addLocation: AddLocation;
  dropHandled: boolean;
  draggedItem?: string;
  variables: VariableWithId[];
}
export type Variable = {
  type: "color" | "font-family";
  name: string;
  value: string;
};
export type History = {
  current: boolean;
  structure: {
    layout: Layout[];
    pageWise: PageWise;
  };
}[];
export interface VariableWithId extends Variable {
  id: string;
}
export type AddLocation = {
  id: string;
  where: Where;
} | null;

export type PageWise = {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  image?: string;
  color: string;
  backgroundColor: string;
  fontSize: string;
  overflow: "auto" | "hidden";
  fontFamily: string;
  lineHeight: string;
  [key: string]: string | undefined;
};

export type Style = {
  padding?: string;
  margin?: string;
  border?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundPosition?: string;
  display?: string;
  textAlign?: "center";
  flexWrap?: "wrap" | "nowrap";
  [key: string]: string | undefined;
};
export type LayoutOrUnd = Layout | undefined;
export type Where = "before" | "after";
export type ItemAndLocation = { item: LayoutOrUnd; addLocation: AddLocation };
export type SizingType = {
  title: string;
};
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type OptionsObject = { title: string; value: string };
export type HandleChangeType = (
  e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  i?: number
) => void;
export type SavePopup = "saving" | "saved" | null;
