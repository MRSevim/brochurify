import useClasses from "@/features/builder/utils/hooks/useClasses";
import { PropsWithId } from "@/features/builder/utils/types.d";
import { styledElements } from "@/features/builder/utils/StyledComponents";
import { RefObject } from "react";

const Image = ({ style, src, alt, ref }: PropsWithId) => {
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
