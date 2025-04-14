import useClasses from "@/utils/hooks/useClasses";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/Helpers";
import { RefObject } from "react";

const Text = ({ id, text, style, ref }: PropsWithId) => {
  const active = useClasses(id);
  return (
    <styledElements.styledDiv
      ref={ref as unknown as RefObject<HTMLDivElement>}
      className={active}
      styles={style}
      dangerouslySetInnerHTML={{ __html: text || "" }}
    ></styledElements.styledDiv>
  );
};

export default Text;
