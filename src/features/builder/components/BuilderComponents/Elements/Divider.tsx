import useClasses from "@/features/builder/utils/hooks/useClasses";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/features/builder/utils/StyledComponents";
import { RefObject } from "react";

const Container = ({ style, ref }: PropsWithId) => {
  const active = useClasses();

  return (
    <styledElements.styledHr
      className={active}
      $styles={style}
      ref={ref as RefObject<HTMLHRElement>}
    />
  );
};

export default Container;
