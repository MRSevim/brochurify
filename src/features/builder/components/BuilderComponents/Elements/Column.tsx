import useClasses from "@/features/builder/utils/hooks/useClasses";
import { styledElements } from "@/features/builder/utils/StyledComponents";
import { ColumnPropsForRendering } from "@/features/builder/utils/types/propTypes.d";
import { RefObject } from "react";

const Column = ({ children, style, ref }: ColumnPropsForRendering) => {
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
