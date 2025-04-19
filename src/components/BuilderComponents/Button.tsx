import useClasses from "@/utils/hooks/useClasses";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/Helpers";
import { RefObject } from "react";

const Button = ({ id, children, style, ref, anchorId }: PropsWithId) => {
  const active = useClasses(id);

  return (
    <styledElements.styledButton
      id={anchorId}
      className={active}
      styles={style}
      ref={ref as unknown as RefObject<HTMLButtonElement>}
    >
      {children}
    </styledElements.styledButton>
  );
};

export default Button;
