import useClasses from "@/features/builder/utils/hooks/useClasses";
import { PropsWithId } from "@/features/builder/utils/types.d";
import { styledElements } from "@/features/builder/utils/StyledComponents";
import { RefObject } from "react";

const Container = ({ style, iconType, ref }: PropsWithId) => {
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
