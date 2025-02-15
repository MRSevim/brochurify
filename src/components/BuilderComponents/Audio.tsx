import { add100PerHeightToStyle } from "@/utils/Helpers";
import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";

const Audio = ({ id, style, src }: PropsWithId) => {
  const active = useActive(id);
  const added = add100PerHeightToStyle(style);
  return (
    <audio className={active} style={added} key={src} controls>
      <source src={src || undefined}></source>
      Your browser does not support the audio tag.
    </audio>
  );
};

export default Audio;
