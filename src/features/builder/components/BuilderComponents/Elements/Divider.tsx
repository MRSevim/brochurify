import useClasses from "@/features/builder/utils/hooks/useClasses";
import { styledElements } from "@/features/builder/utils/StyledComponents";
import { DividerPropsForRendering } from "@/features/builder/utils/types/propTypes.d";
import { RefObject } from "react";

const Container = ({ style, ref }: DividerPropsForRendering) => {
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
