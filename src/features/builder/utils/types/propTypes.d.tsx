import { Style } from "./types.d";

type IdObj = { id: string };
type ChildrenObj = { children: React.ReactNode };
type RenderingObj = IdObj & {
  ref?: React.RefObject<HTMLElement | null>;
};

type ButtonProps = {
  style: Style;
  child: Layout[];
  href: string;
  newTab: boolean;
  anchorId: string;
};

export type ButtonPropsForRendering = RenderingObj & ChildrenObj & ButtonProps;

type ButtonLayout = IdObj & {
  type: "button";
  props: ButtonProps;
};

type ColumnProps = {
  style: Style;
  child: Layout[];
  anchorId: string;
};

export type ColumnPropsForRendering = RenderingObj & ChildrenObj & ColumnProps;

type ColumnLayout = IdObj & {
  type: "column";
  props: ColumnProps;
};

type TextProps = {
  style: Style;
  anchorId: string;
  text: string;
};

export type TextPropsForRendering = RenderingObj & TextProps;

type TextLayout = IdObj & {
  type: "text";
  props: TextProps;
};

type RowProps = {
  style: Style;
  child: Layout[];
  anchorId: string;
};

export type RowPropsForRendering = RenderingObj & ChildrenObj & RowProps;

type RowLayout = IdObj & {
  type: "row";
  props: RowProps;
};

type ImageProps = {
  style: Style;
  anchorId: string;
  src: string;
  alt: string;
};

export type ImagePropsForRendering = RenderingObj & ImageProps;

type ImageLayout = IdObj & {
  type: "image";
  props: ImageProps;
};

type AudioProps = {
  style: Style;
  anchorId: string;
  src: string;
};

export type AudioPropsForRendering = RenderingObj & AudioProps;

type AudioLayout = IdObj & {
  type: "audio";
  props: AudioProps;
};

type VideoProps = {
  style: Style;
  anchorId: string;
  src: string;
};

export type VideoPropsForRendering = RenderingObj & VideoProps;

type VideoLayout = IdObj & {
  type: "video";
  props: VideoProps;
};

type ContainerProps = {
  style: Style;
  anchorId: string;
  src: string;
  child: Layout[];
};

export type ContainerPropsForRendering = RenderingObj &
  ChildrenObj &
  ContainerProps;

type ContainerLayout = IdObj & {
  type: "container";
  props: ContainerProps;
};

type DividerProps = {
  style: Style;
  anchorId: string;
};

export type DividerPropsForRendering = RenderingObj & DividerProps;

type DividerLayout = IdObj & {
  type: "divider";
  props: DividerProps;
};

type IconProps = {
  style: Style;
  anchorId: string;
  iconType: string;
};

export type IconPropsForRendering = RenderingObj & IconProps;

type IconLayout = IdObj & {
  type: "icon";
  props: IconProps;
};

type FixedProps = {
  style: Style;
  anchorId: string;
  src: string;
  child: Layout[];
};

export type FixedPropsForRendering = RenderingObj & ChildrenObj & FixedProps;

type FixedLayout = IdObj & {
  type: "fixed";
  props: FixedProps;
};

export type Layout =
  | ButtonLayout
  | ColumnLayout
  | TextLayout
  | RowLayout
  | ImageLayout
  | AudioLayout
  | VideoLayout
  | DividerLayout
  | IconLayout
  | FixedLayout
  | ContainerLayout;

export type EditablePropKeys =
  | "anchorId"
  | "newTab"
  | "iconType"
  | "text"
  | "href"
  | "src"
  | "alt";

export type LayoutTypes =
  | "icon"
  | "fixed"
  | "button"
  | "column"
  | "text"
  | "row"
  | "image"
  | "audio"
  | "video"
  | "container"
  | "divider";
