import { Style } from "./types.d";

type IdObj = { id: string };
type ChildrenObj = { children: React.ReactNode };
type RenderingObj = IdObj & {
  ref?: React.RefObject<HTMLElement | null>;
};

export type ButtonProps = {
  style: Style;
  child: Layout[];
  href: string;
  newTab: boolean;
  anchorId: string;
};

export type ButtonPropsForRendering = RenderingObj & ChildrenObj & ButtonProps;

export type ButtonLayout = IdObj & {
  type: "button";
  props: ButtonProps;
};

export type ColumnProps = {
  style: Style;
  child: Layout[];
  anchorId: string;
};

export type ColumnPropsForRendering = RenderingObj & ChildrenObj & ColumnProps;

export type ColumnLayout = IdObj & {
  type: "column";
  props: ColumnProps;
};

export type TextProps = {
  style: Style;
  anchorId: string;
  text: string;
};

export type TextPropsForRendering = RenderingObj & TextProps;

export type TextLayout = IdObj & {
  type: "text";
  props: TextProps;
};

export type RowProps = {
  style: Style;
  child: Layout[];
  anchorId: string;
};

export type RowPropsForRendering = RenderingObj & ChildrenObj & RowProps;

export type RowLayout = IdObj & {
  type: "row";
  props: RowProps;
};

export type ImageProps = {
  style: Style;
  anchorId: string;
  src: string;
  alt: string;
};

export type ImagePropsForRendering = RenderingObj & ImageProps;

export type ImageLayout = IdObj & {
  type: "image";
  props: ImageProps;
};

export type AudioProps = {
  style: Style;
  anchorId: string;
  src: string;
};

export type AudioPropsForRendering = RenderingObj & AudioProps;

export type AudioLayout = IdObj & {
  type: "audio";
  props: AudioProps;
};

export type VideoProps = {
  style: Style;
  anchorId: string;
  src: string;
};

export type VideoPropsForRendering = RenderingObj & VideoProps;

export type VideoLayout = IdObj & {
  type: "video";
  props: VideoProps;
};

export type ContainerProps = {
  style: Style;
  anchorId: string;
  src: string;
  child: Layout[];
};

export type ContainerPropsForRendering = RenderingObj &
  ChildrenObj &
  ContainerProps;

export type ContainerLayout = IdObj & {
  type: "container";
  props: ContainerProps;
};

export type DividerProps = {
  style: Style;
  anchorId: string;
};

export type DividerPropsForRendering = RenderingObj & DividerProps;

export type DividerLayout = IdObj & {
  type: "divider";
  props: DividerProps;
};

export type IconProps = {
  style: Style;
  anchorId: string;
  iconType: string;
};

export type IconPropsForRendering = RenderingObj & IconProps;

export type IconLayout = IdObj & {
  type: "icon";
  props: IconProps;
};

export type FixedProps = {
  style: Style;
  anchorId: string;
  src: string;
  child: Layout[];
};

export type FixedPropsForRendering = RenderingObj & ChildrenObj & FixedProps;

export type FixedLayout = IdObj & {
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
