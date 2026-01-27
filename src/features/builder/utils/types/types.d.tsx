import { StringOrUnd } from "@/utils/types/Types.d";
import { Layout } from "./propTypes.d";

export interface EditorState {
  type: "project" | "template";
  id?: string;
  active?: string;
  hovered?: OverType;
  draggedOver?: OverType;
  history: History[];
  layout: Layout[];
  pageWise: PageWise;
  addLocation: AddLocation;
  dropHandled: boolean;
  draggedItem?: string;
  variables: Variable[];
  copied?: Layout;
  published?: boolean;
  domainVerified?: boolean;
  customDomain?: string;
  prefix?: string;
}
export type Variable = {
  id?: string;
  type: string;
  name: string;
  value: string;
};
export type History = {
  current: boolean;
  structure: {
    layout: Layout[];
    pageWise: PageWise;
  };
};
export type AddLocation = {
  id: string;
  where: Where;
} | null;

export type PageWise = {
  title: string;
  description: string;
  keywords: string;
  image: string;
  color: string;
  "background-color": string;
  "background-image"?: string;
  "background-size"?: string;
  "background-position"?: string;
  "background-repeat"?: string;
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
  hideOverFlowBefore?: string;
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
  "max-height"?: string;
  "min-width"?: string;
  "min-height"?: string;
  gap?: string;
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
  transition?: string;
  scale?: string;
  rotate?: string;
  opacity?: string;
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

export type LayoutOrUnd = Layout | undefined;

export type OverType = { id: string; where?: Where };
export type Where = "before" | "after";
export type ItemAndLocation = {
  item: LayoutOrUnd;
  targetId: StringOrUnd;
  addLocation: AddLocation;
};

export type OptionsObject = { id?: string; title: string; value: string };

export const CONFIG = {
  placeholderImgUrl: "/placeholder-image.jpg",
  headings: "h1,h2,h3,h4,h5,h6",
  possibleOuterTypes: {
    active: "&:active",
    scrolled: "&.scrolled",
    hover: "&:hover",
    tabletContainerQuery: "@container (max-width: 768px)",
    mobileContainerQuery: "@container (max-width: 360px)",
  },
} as const;

const possibleOuterTypesArr = [...Object.values(CONFIG.possibleOuterTypes)];

export type PossibleOuterTypes = (typeof possibleOuterTypesArr)[number];
