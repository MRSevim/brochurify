import useClasses from "@/features/builder/utils/hooks/useClasses";
import { styledElements } from "@/features/builder/utils/StyledComponents";
import { FixedPropsForRendering } from "@/features/builder/utils/types/propTypes.d";

const Fixed = ({ children, style, ref }: FixedPropsForRendering) => {
  const active = useClasses(true);
  return (
    <styledElements.styledFixed className={active} $styles={style} ref={ref}>
      {children}
    </styledElements.styledFixed>
  );
};

export default Fixed;
