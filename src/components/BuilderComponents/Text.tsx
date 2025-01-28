import { Props } from "@/utils/Types";

const Text = ({ text, style }: Props) => {
  return <p style={style}>{text}</p>;
};

export default Text;
