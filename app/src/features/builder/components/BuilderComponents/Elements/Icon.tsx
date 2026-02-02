import useClasses from "@/features/builder/utils/hooks/useClasses";
import { styledElements } from "@/features/builder/utils/StyledComponents";
import { IconPropsForRendering } from "@/features/builder/utils/types/propTypes.d";

const Container = ({ style, iconType, ref }: IconPropsForRendering) => {
  const active = useClasses();

  return (
    <styledElements.styledI
      className={active + ` bi bi-${iconType}`}
      $styles={style}
      ref={ref}
    />
  );
};

export default Container;
