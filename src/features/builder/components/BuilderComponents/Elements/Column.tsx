import useClasses from "@/features/builder/utils/hooks/useClasses";
import { PropsWithId } from "@/utils/types/Types";
import { styledElements } from "@/features/builder/utils/StyledComponents";
import { RefObject } from "react";

const Column = ({ children, style, ref }: PropsWithId) => {
  const active = useClasses();

  return (
    <styledElements.styledDiv
      className={active}
      $styles={style}
      ref={ref as RefObject<HTMLDivElement>}
    >
      {children}
    </styledElements.styledDiv>
  );
};

export default Column;
