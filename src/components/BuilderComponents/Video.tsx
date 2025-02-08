import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";

const Video = ({ id, style, src, width, height }: PropsWithId) => {
  const active = useActive(id);
  return (
    <video
      className={active}
      key={src}
      controls
      style={{ width, height, ...style }}
    >
      <source src={src || undefined}></source>
      Your browser does not support the video tag.
    </video>
  );
};

export default Video;
