import useClasses from "@/features/builder/utils/hooks/useClasses";
import { styledElements } from "@/features/builder/utils/StyledComponents";
import { ColumnPropsForRendering } from "@/features/builder/utils/types/propTypes.d";

const Column = ({ children, style, ref }: ColumnPropsForRendering) => {
  const active = useClasses();

  return (
    <styledElements.styledDiv className={active} $styles={style} ref={ref}>
      {children}
    </styledElements.styledDiv>
  );
};

export default Column;
