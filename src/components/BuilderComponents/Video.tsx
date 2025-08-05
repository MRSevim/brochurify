import useClasses from "@/utils/hooks/useClasses";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/StyledComponents";
import { RefObject, memo } from "react";

const Video = memo(({ style, src, ref }: PropsWithId) => {
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
});

export default Video;
