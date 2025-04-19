import useClasses from "@/utils/hooks/useClasses";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/Helpers";
import { RefObject } from "react";

const Image = ({ id, style, src, alt, ref, anchorId }: PropsWithId) => {
  const active = useClasses(id);

  return (
    <styledElements.styledImg
      className={active}
      id={anchorId}
      src={src || undefined}
      alt={alt}
      styles={style}
      ref={ref as unknown as RefObject<HTMLImageElement>}
    />
  );
};

export default Image;
