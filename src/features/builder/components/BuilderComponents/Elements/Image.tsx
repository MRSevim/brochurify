import useClasses from "@/features/builder/utils/hooks/useClasses";
import { styledElements } from "@/features/builder/utils/StyledComponents";
import { ImagePropsForRendering } from "@/features/builder/utils/types/propTypes.d";

const Image = ({ style, src, alt, ref }: ImagePropsForRendering) => {
  const active = useClasses();

  return (
    <styledElements.styledImg
      className={active}
      src={src || undefined}
      alt={alt}
      $styles={style}
      ref={ref}
    />
  );
};

export default Image;
