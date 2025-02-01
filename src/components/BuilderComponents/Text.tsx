import { Props } from "@/utils/Types";

const Text = ({ text, style }: Props) => {
  return <p style={style} dangerouslySetInnerHTML={{ __html: text || "" }}></p>;
};

export default Text;
