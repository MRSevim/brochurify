import { Props } from "@/utils/Types";

const Column = ({ children, style }: Props) => {
  return <div style={style}>{children}</div>;
};

export default Column;
