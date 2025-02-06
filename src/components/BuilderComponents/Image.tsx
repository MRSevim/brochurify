import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";

const Image = ({ id, style, src, alt, width, height }: PropsWithId) => {
  const active = useActive(id);
  return (
    <div className={active} style={style}>
      <img src={src || undefined} alt={alt} style={{ width, height }}></img>
    </div>
  );
};

export default Image;
