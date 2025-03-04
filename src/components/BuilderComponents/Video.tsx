import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/Helpers";
import { RefObject } from "react";

const Video = ({ id, style, src, ref }: PropsWithId) => {
  const active = useActive(id);
  return (
    <styledElements.styledVideo
      className={active}
      key={src}
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
