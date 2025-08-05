import useClasses from "@/utils/hooks/useClasses";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/StyledComponents";
import { memo, RefObject } from "react";

const Text = memo(({ text, style, ref }: PropsWithId) => {
  const active = useClasses();

  return (
    <styledElements.styledDiv
      ref={ref as RefObject<HTMLDivElement>}
      className={active}
      $styles={style}
      dangerouslySetInnerHTML={{ __html: text || "" }}
    ></styledElements.styledDiv>
  );
});

export default Text;
