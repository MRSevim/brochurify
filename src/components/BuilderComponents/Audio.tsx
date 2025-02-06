import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";

const Audio = ({ id, style, src }: PropsWithId) => {
  const active = useActive(id);
  return (
    <div className={active} style={style}>
      <audio key={src} controls>
        <source src={src || undefined}></source>
        Your browser does not support the audio tag.
      </audio>
    </div>
  );
};

export default Audio;
