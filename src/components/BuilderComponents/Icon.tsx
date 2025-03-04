import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/Helpers";
import { RefObject } from "react";

const Container = ({ id, style, iconType, ref }: PropsWithId) => {
  const active = useActive(id);

  return (
    <styledElements.styledI
      className={active + ` bi bi-${iconType}`}
      styles={style}
      ref={ref as unknown as RefObject<HTMLLIElement>}
    />
  );
};

export default Container;
