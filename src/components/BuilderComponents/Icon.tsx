import useClasses from "@/utils/hooks/useClasses";
import { Props } from "@/utils/Types";
import { styledElements } from "@/utils/StyledComponents";
import { RefObject } from "react";

const Container = ({ style, iconType, ref }: Props) => {
  const active = useClasses();

  return (
    <styledElements.styledI
      className={active + ` bi bi-${iconType}`}
      $styles={style}
      ref={ref as RefObject<HTMLLIElement>}
    />
  );
};

export default Container;
