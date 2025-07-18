import useClasses from "@/utils/hooks/useClasses";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/StyledComponents";
import { RefObject } from "react";

const Fixed = ({ id, children, style, ref, anchorId }: PropsWithId) => {
  const active = useClasses(true);
  return (
    <styledElements.styledFixed
      className={active}
      id={anchorId}
      $styles={style}
      ref={ref as unknown as RefObject<HTMLDivElement>}
    >
      {children}
    </styledElements.styledFixed>
  );
};

export default Fixed;
