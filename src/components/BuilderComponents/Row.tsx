import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/Helpers";
import { RefObject } from "react";

const Row = ({ id, children, style, ref }: PropsWithId) => {
  const active = useActive(id);

  return (
    <styledElements.styledDiv
      className={active}
      styles={style}
      ref={ref as unknown as RefObject<HTMLDivElement>}
    >
      {children}
    </styledElements.styledDiv>
  );
};

export default Row;
