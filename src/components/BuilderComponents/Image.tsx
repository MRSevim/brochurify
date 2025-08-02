import useClasses from "@/utils/hooks/useClasses";
import { Props } from "@/utils/Types";
import { styledElements } from "@/utils/StyledComponents";
import { RefObject } from "react";

const Image = ({ style, src, alt, ref }: Props) => {
  const active = useClasses();

  return (
    <styledElements.styledImg
      className={active}
      src={src || undefined}
      alt={alt}
      $styles={style}
      ref={ref as RefObject<HTMLImageElement>}
    />
  );
};

export default Image;
