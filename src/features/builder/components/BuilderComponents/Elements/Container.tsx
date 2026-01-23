import useClasses from "@/features/builder/utils/hooks/useClasses";
import { styledElements } from "@/features/builder/utils/StyledComponents";
import { ContainerPropsForRendering } from "@/features/builder/utils/types/propTypes.d";

const Container = ({ children, style, ref }: ContainerPropsForRendering) => {
  const active = useClasses();

  return (
    <styledElements.styledDiv className={active} $styles={style} ref={ref}>
      {children}
    </styledElements.styledDiv>
  );
};

export default Container;
