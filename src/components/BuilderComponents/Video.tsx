import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";

const Video = ({ id, style, src, width, height }: PropsWithId) => {
  const active = useActive(id);
  return (
    <div className={active} style={style}>
      <video key={src} controls style={{ width, height }}>
        <source src={src || undefined}></source>
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default Video;
