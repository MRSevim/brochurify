import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";

const Image = ({ id, style, src, alt }: PropsWithId) => {
  const active = useActive(id);
  return (
    <img
      className={active}
      src={src || undefined}
      alt={alt}
      style={style}
    ></img>
  );
};

export default Image;
