import { Props } from "@/utils/Types";

const Text = ({ text, style }: Props) => {
  return <div style={style}>{text}</div>;
};

export default Text;
