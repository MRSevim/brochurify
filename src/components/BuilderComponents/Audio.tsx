import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/Helpers";
import { RefObject } from "react";
const Audio = ({ id, style, src, ref }: PropsWithId) => {
  const active = useActive(id);

  return (
    <styledElements.styledAudio
      className={active}
      styles={style}
      key={src}
      ref={ref as unknown as RefObject<HTMLAudioElement>}
      controls
    >
      <source src={src || undefined}></source>
      Your browser does not support the audio tag.
    </styledElements.styledAudio>
  );
};

export default Audio;
