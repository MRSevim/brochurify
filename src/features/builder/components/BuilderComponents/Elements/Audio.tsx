import useClasses from "@/features/builder/utils/hooks/useClasses";
import { styledElements } from "@/features/builder/utils/StyledComponents";
import { AudioPropsForRendering } from "@/features/builder/utils/types/propTypes.d";

const Audio = ({ style, src, ref }: AudioPropsForRendering) => {
  const active = useClasses();

  return (
    <styledElements.styledAudio
      className={active}
      $styles={style}
      key={src}
      ref={ref}
      controls
    >
      <source src={src || undefined}></source>
      Your browser does not support the audio tag.
    </styledElements.styledAudio>
  );
};

export default Audio;
