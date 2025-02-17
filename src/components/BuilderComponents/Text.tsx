import { add100PerToStyle } from "@/utils/Helpers";
import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";

const Text = ({ id, text, style }: PropsWithId) => {
  const active = useActive(id);
  const added = add100PerToStyle(style);
  return (
    <div
      className={active}
      style={added}
      dangerouslySetInnerHTML={{ __html: text || "" }}
    ></div>
  );
};

export default Text;
