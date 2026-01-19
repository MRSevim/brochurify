import useClasses from "@/features/builder/utils/hooks/useClasses";
import { PropsWithId } from "@/features/builder/utils/types.d";
import { styledElements } from "@/features/builder/utils/StyledComponents";
import { RefObject } from "react";

const Video = ({ style, src, ref }: PropsWithId) => {
  const active = useClasses();
  return (
    <styledElements.styledVideo
      className={active}
      key={src}
      controls
      $styles={style}
      ref={ref as RefObject<HTMLVideoElement>}
    >
      <source src={src || undefined}></source>
      Your browser does not support the video tag.
    </styledElements.styledVideo>
  );
};

export default Video;
