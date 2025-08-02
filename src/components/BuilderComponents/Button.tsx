import useClasses from "@/utils/hooks/useClasses";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/StyledComponents";
import { RefObject } from "react";

const Button = ({ children, style, ref }: PropsWithId) => {
  const active = useClasses();

  return (
    <styledElements.styledButton
      className={active}
      $styles={style}
      ref={ref as RefObject<HTMLAnchorElement>}
    >
      {children}
    </styledElements.styledButton>
  );
};

export default Button;
