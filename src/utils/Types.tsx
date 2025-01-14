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
