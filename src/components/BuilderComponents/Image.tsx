import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/Helpers";

const Image = ({ id, style, src, alt }: PropsWithId) => {
  const active = useActive(id);

  return (
    <styledElements.styledImg
      className={active}
      src={src || undefined}
      alt={alt}
      styles={style}
    />
  );
};

export default Image;
