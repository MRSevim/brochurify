import { add100PerHeightToStyle } from "@/utils/Helpers";
import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";

const Image = ({ id, style, src, alt }: PropsWithId) => {
  const active = useActive(id);
  const added = add100PerHeightToStyle(style);
  return (
    <img
      className={active}
      src={src || undefined}
      alt={alt}
      style={added}
    ></img>
  );
};

export default Image;
