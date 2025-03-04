import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/Helpers";
import { RefObject } from "react";

const Fixed = ({ id, children, style, ref }: PropsWithId) => {
  const active = useActive(id, true);
  return (
    <styledElements.styledFixed
      className={active}
      styles={style}
      ref={ref as unknown as RefObject<HTMLDivElement>}
    >
      {children}
    </styledElements.styledFixed>
  );
};

export default Fixed;
