import useClasses from "@/utils/hooks/useClasses";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/StyledComponents";
import { memo, RefObject } from "react";

const Container = memo(({ style, ref }: PropsWithId) => {
  const active = useClasses();

  return (
    <styledElements.styledHr
      className={active}
      $styles={style}
      ref={ref as RefObject<HTMLHRElement>}
    />
  );
});

export default Container;
