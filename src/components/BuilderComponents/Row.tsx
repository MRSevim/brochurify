import useClasses from "@/utils/hooks/useClasses";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/StyledComponents";
import { RefObject } from "react";

const Row = ({ id, children, style, ref, anchorId }: PropsWithId) => {
  const active = useClasses();

  return (
    <styledElements.styledDiv
      className={active}
      id={anchorId}
      $styles={style}
      ref={ref as unknown as RefObject<HTMLDivElement>}
    >
      {children}
    </styledElements.styledDiv>
  );
};

export default Row;
