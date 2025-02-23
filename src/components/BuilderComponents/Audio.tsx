import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/Helpers";
const Audio = ({ id, style, src }: PropsWithId) => {
  const active = useActive(id);

  return (
    <styledElements.styledAudio
      className={active}
      styles={style}
      key={src}
      controls
    >
      <source src={src || undefined}></source>
      Your browser does not support the audio tag.
    </styledElements.styledAudio>
  );
};

export default Audio;
