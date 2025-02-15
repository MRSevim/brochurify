import { add100PerHeightToStyle } from "@/utils/Helpers";
import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";

const Text = ({ id, text, style }: PropsWithId) => {
  const active = useActive(id);
  const added = add100PerHeightToStyle(style);
  return (
    <div
      className={active}
      style={added}
      dangerouslySetInnerHTML={{ __html: text || "" }}
    ></div>
  );
};

export default Text;
