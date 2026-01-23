import useClasses from "@/features/builder/utils/hooks/useClasses";
import { styledElements } from "@/features/builder/utils/StyledComponents";
import { RowPropsForRendering } from "@/features/builder/utils/types/propTypes.d";

const Row = ({ children, style, ref }: RowPropsForRendering) => {
  const active = useClasses();

  return (
    <styledElements.styledDiv className={active} $styles={style} ref={ref}>
      {children}
    </styledElements.styledDiv>
  );
};

export default Row;
