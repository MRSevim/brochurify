import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";

const Text = ({ id, text, style }: PropsWithId) => {
  const active = useActive(id);
  return (
    <div
      className={active}
      style={style}
      dangerouslySetInnerHTML={{ __html: text || "" }}
    ></div>
  );
};

export default Text;
