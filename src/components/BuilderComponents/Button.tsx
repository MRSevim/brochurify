import useClasses from "@/utils/hooks/useClasses";
import { Props } from "@/utils/Types";
import { styledElements } from "@/utils/StyledComponents";
import { RefObject } from "react";

const Button = ({ children, style, ref }: Props) => {
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
