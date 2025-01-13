export interface Props {
  text?: string;
  children?: Layout;
}
export interface PropsWithNodeChildren {
  children: React.ReactNode;
}
export interface Layout {
  id: string;
  type: string;
  props: Props;
}
