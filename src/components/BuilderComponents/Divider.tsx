import useClasses from "@/utils/hooks/useClasses";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/StyledComponents";
import { RefObject } from "react";

const Container = ({ id, style, ref, anchorId }: PropsWithId) => {
  const active = useClasses();

  return (
    <styledElements.styledHr
      className={active}
      id={anchorId}
      styles={style}
      ref={ref as unknown as RefObject<HTMLHRElement>}
    />
  );
};

export default Container;
