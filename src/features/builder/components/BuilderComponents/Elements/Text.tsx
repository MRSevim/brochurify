import useClasses from "@/features/builder/utils/hooks/useClasses";
import { PropsWithId } from "@/utils/types/Types";
import { styledElements } from "@/features/builder/utils/StyledComponents";
import { RefObject } from "react";

const Text = ({ text, style, ref }: PropsWithId) => {
  const active = useClasses();

  return (
    <styledElements.styledP
      ref={ref as RefObject<HTMLDivElement>}
      className={active}
      $styles={style}
      dangerouslySetInnerHTML={{ __html: text || "" }}
    ></styledElements.styledP>
  );
};

export default Text;
