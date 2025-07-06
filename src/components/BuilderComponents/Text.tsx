import useClasses from "@/utils/hooks/useClasses";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/StyledComponents";
import { RefObject } from "react";

const Text = ({ id, text, style, ref, anchorId }: PropsWithId) => {
  const active = useClasses();

  return (
    <styledElements.styledDiv
      ref={ref as unknown as RefObject<HTMLDivElement>}
      className={active}
      id={anchorId}
      $styles={style}
      dangerouslySetInnerHTML={{ __html: text || "" }}
    ></styledElements.styledDiv>
  );
};

export default Text;
