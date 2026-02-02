import useClasses from "@/features/builder/utils/hooks/useClasses";
import { styledElements } from "@/features/builder/utils/StyledComponents";
import { ButtonPropsForRendering } from "@/features/builder/utils/types/propTypes.d";
import { RefObject } from "react";

const Button = ({ children, style, ref }: ButtonPropsForRendering) => {
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
