import useClasses from "@/utils/hooks/useClasses";
import { Props } from "@/utils/Types";
import { styledElements } from "@/utils/StyledComponents";
import { RefObject } from "react";

const Fixed = ({ children, style, ref }: Props) => {
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
