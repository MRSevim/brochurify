import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";

const Text = ({ id, text, style }: PropsWithId) => {
  const active = useActive(id);
  return (
    <p
      className={active}
      style={style}
      dangerouslySetInnerHTML={{ __html: text || "" }}
    ></p>
  );
};

export default Text;
