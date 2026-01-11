import useClasses from "@/features/builder/utils/hooks/useClasses";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/features/builder/utils/StyledComponents";
import { RefObject } from "react";

const Fixed = ({ children, style, ref }: PropsWithId) => {
  const active = useClasses(true);
  return (
    <styledElements.styledFixed
      className={active}
      $styles={style}
      ref={ref as RefObject<HTMLDivElement>}
    >
      {children}
    </styledElements.styledFixed>
  );
};

export default Fixed;
