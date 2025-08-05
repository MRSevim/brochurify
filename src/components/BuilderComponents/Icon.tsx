import useClasses from "@/utils/hooks/useClasses";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/StyledComponents";
import { memo, RefObject } from "react";

const Container = memo(({ style, iconType, ref }: PropsWithId) => {
  const active = useClasses();

  return (
    <styledElements.styledI
      className={active + ` bi bi-${iconType}`}
      $styles={style}
      ref={ref as RefObject<HTMLLIElement>}
    />
  );
});

export default Container;
