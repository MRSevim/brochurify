import useClasses from "@/utils/hooks/useClasses";
import { Props } from "@/utils/Types";
import { styledElements } from "@/utils/StyledComponents";
import { RefObject } from "react";

const Text = ({ text, style, ref }: Props) => {
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
