import { ChangeEvent, RefObject } from "react";
import { CONFIG } from "./Helpers";

export interface Props {
  text?: string;
  style: Style;
  child?: Layout[];
  src?: string;
  href?: string;
  newTab?: boolean;
  alt?: string;
  anchorId?: string;
  iconType?: string;
  children?: React.ReactNode;
  [key: string]:
    | string
    | boolean
    | Style
    | Layout[]
    | React.ReactNode
    | undefined;
}
export interface PropsWithId {
  id: string;
  text?: string;
  style: Style;
  child?: Layout[];
  src?: string;
  href?: string;
  newTab?: boolean;
  alt?: string;
  anchorId?: string;
  iconType?: string;
  children?: React.ReactNode;
  ref?: ElementRefObject;
  [key: string]:
    | string
    | boolean
    | Style
    | Layout[]
    | React.ReactNode
    | undefined
    | ElementRefObject;
}
export interface Layout {
  id: string;
  type: string;
  props: Props;
}
export interface EditorState {
  active?: LayoutOrUnd;
  hovered?: string;
  history: History;
  layout: Layout[];
  pageWise: PageWise;
  addLocation: AddLocation;
  dropHandled: boolean;
  draggedItem?: string;
  variables: Variable[];
  copied?: Layout;
}
export type Variable = {
  id: string;
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
  height: string;
  overflow: "auto";
  "font-family": string;
  "line-height": string;
  "container-type": string;
  [CONFIG.headings]?: Style;
  h1: Style;
  h2: Style;
  h3: Style;
  iconUrl: string;
  [key: string]: string | Style | undefined;
};

export type Style = {
  padding?: string;
  margin?: string;
  border?: string;
  width?: string;
  height?: string;
  top?: string;
  bottom?: string;
  right?: string;
  left?: string;
  "max-width"?: string;
  "border-radius"?: string;
  "background-color"?: string;
  "background-image"?: string;
  "background-size"?: string;
  "background-position"?: string;
  "background-repeat"?: string;
  display?: string;
  "flex-direction"?: string;
  "font-size"?: string;
  "text-align"?: string;
  "flex-wrap"?: "wrap" | "nowrap" | "wrap-reverse";
  "box-shadow"?: string;
  animation?: string;
  "justify-content"?: string;
  "align-items"?: string;
  position?: string;
  [CONFIG.possibleOuterTypes.scrolled]?: Style;
  [CONFIG.possibleOuterTypes.hover]?: Style;
  [CONFIG.possibleOuterTypes.active]?: Style;
  [CONFIG.possibleOuterTypes.tabletContainerQuery]?: Style;
  [CONFIG.possibleOuterTypes.mobileContainerQuery]?: Style;
  [key: string]: StringOrUnd | Style;
};
export type ElementRefObject = RefObject<HTMLElement | null>;
export type StringOrUnd = string | undefined;
export type LayoutOrUnd = Layout | undefined;
export type Where = "before" | "after";
export type ItemAndLocation = { item: LayoutOrUnd; addLocation: AddLocation };
export type SizingType = {
  title: string;
};
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type OptionsObject = { id?: string; title: string; value: string };
export type AppChangeEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement>;
export type HandleChangeType = (e: AppChangeEvent, i?: number) => void;
export type SavePopup = "saving" | "saved" | null;
export type MoveTo = { item: Layout; location: "previous" | "next" };
