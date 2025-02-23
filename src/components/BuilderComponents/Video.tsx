import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/Helpers";

const Video = ({ id, style, src }: PropsWithId) => {
  const active = useActive(id);
  return (
    <styledElements.styledVideo
      className={active}
      key={src}
      controls
      styles={style}
    >
      <source src={src || undefined}></source>
      Your browser does not support the video tag.
    </styledElements.styledVideo>
  );
};

export default Video;
