import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/Helpers";

const Text = ({ id, text, style }: PropsWithId) => {
  const active = useActive(id);
  return (
    <styledElements.styledDiv
      className={active}
      styles={style}
      dangerouslySetInnerHTML={{ __html: text || "" }}
    ></styledElements.styledDiv>
  );
};

export default Text;
