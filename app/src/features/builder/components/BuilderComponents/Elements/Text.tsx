import useClasses from "@/features/builder/utils/hooks/useClasses";
import { styledElements } from "@/features/builder/utils/StyledComponents";
import { TextPropsForRendering } from "@/features/builder/utils/types/propTypes.d";
import { RefObject } from "react";

const Text = ({ text, style, ref }: TextPropsForRendering) => {
  const active = useClasses();

  return (
    <styledElements.styledDiv
      ref={ref as RefObject<HTMLDivElement>}
      className={active}
      $styles={style}
      dangerouslySetInnerHTML={{ __html: text || "" }}
    ></styledElements.styledDiv>
  );
};

export default Text;
