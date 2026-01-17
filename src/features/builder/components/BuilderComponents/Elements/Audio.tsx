import useClasses from "@/features/builder/utils/hooks/useClasses";
import { PropsWithId } from "@/utils/types/Types";
import { styledElements } from "@/features/builder/utils/StyledComponents";
import { RefObject } from "react";
const Audio = ({ style, src, ref }: PropsWithId) => {
  const active = useClasses();

  return (
    <styledElements.styledAudio
      className={active}
      $styles={style}
      key={src}
      ref={ref as RefObject<HTMLAudioElement>}
      controls
    >
      <source src={src || undefined}></source>
      Your browser does not support the audio tag.
    </styledElements.styledAudio>
  );
};

export default Audio;
