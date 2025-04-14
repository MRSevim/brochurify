import useClasses from "@/utils/hooks/useClasses";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/Helpers";
import { RefObject } from "react";

const Container = ({ id, children, style, ref }: PropsWithId) => {
  const active = useClasses(id);

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

export default Container;
