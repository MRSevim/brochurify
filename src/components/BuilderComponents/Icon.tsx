import useClasses from "@/utils/hooks/useClasses";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/StyledComponents";
import { RefObject } from "react";

const Container = ({ id, style, iconType, ref, anchorId }: PropsWithId) => {
  const active = useClasses();

  return (
    <styledElements.styledI
      className={active + ` bi bi-${iconType}`}
      id={anchorId}
      $styles={style}
      ref={ref as unknown as RefObject<HTMLLIElement>}
    />
  );
};

export default Container;
