import { add100PerToStyle } from "@/utils/Helpers";
import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";

const Video = ({ id, style, src }: PropsWithId) => {
  const active = useActive(id);
  const added = add100PerToStyle(style);
  return (
    <video className={active} key={src} controls style={added}>
      <source src={src || undefined}></source>
      Your browser does not support the video tag.
    </video>
  );
};

export default Video;
