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
  copied?: Layout;
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
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  image: string;
  color: string;
  "background-color": string;
  "font-size": string;
  overflow: "auto";
  "font-family": string;
  "line-height": string;
  iconUrl: string;
  [key: string]: string | undefined;
};

export type Style = {
  padding?: string;
  margin?: string;
  border?: string;
  width?: string;
  height?: string;
  "max-width"?: string;
  "border-radius"?: string;
  "background-color"?: string;
  "background-image"?: string;
  "background-position"?: string;
  "background-repeat"?: string;
  display?: string;
  "font-size"?: string;
  "text-align"?: "center";
  "flex-wrap"?: "wrap" | "nowrap";
  "box-shadow"?: string;
  animation?: string;
  "justify-content"?: string;
  "align-items"?: string;
  "&:hover"?: Style;
  "&:active"?: Style;
  [key: string]: StringOrUnd | Style;
};

export type StringOrUnd = string | undefined;
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
