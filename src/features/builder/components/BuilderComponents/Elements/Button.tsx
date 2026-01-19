import useClasses from "@/features/builder/utils/hooks/useClasses";
import { PropsWithId } from "@/features/builder/utils/types.d";
import { styledElements } from "@/features/builder/utils/StyledComponents";
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
