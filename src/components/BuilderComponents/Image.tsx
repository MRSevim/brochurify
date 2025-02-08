import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";

const Image = ({ id, style, src, alt, width, height }: PropsWithId) => {
  const active = useActive(id);
  return (
    <img
      className={active}
      src={src || undefined}
      alt={alt}
      style={{ width, height, ...style }}
    ></img>
  );
};

export default Image;
