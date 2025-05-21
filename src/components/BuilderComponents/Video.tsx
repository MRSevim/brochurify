import useClasses from "@/utils/hooks/useClasses";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/StyledComponents";
import { RefObject } from "react";

const Video = ({ id, style, src, ref, anchorId }: PropsWithId) => {
  const active = useClasses(id);
  return (
    <styledElements.styledVideo
      className={active}
      key={src}
      id={anchorId}
      controls
      styles={style}
      ref={ref as unknown as RefObject<HTMLVideoElement>}
    >
      <source src={src || undefined}></source>
      Your browser does not support the video tag.
    </styledElements.styledVideo>
  );
};

export default Video;
