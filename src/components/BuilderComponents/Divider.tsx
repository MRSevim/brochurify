import useClasses from "@/utils/hooks/useClasses";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/Helpers";
import { RefObject } from "react";

const Container = ({ id, style, ref }: PropsWithId) => {
  const active = useClasses(id);

  return (
    <styledElements.styledHr
      className={active}
      styles={style}
      ref={ref as unknown as RefObject<HTMLHRElement>}
    />
  );
};

export default Container;
