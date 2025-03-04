import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/Helpers";
import { RefObject } from "react";

const Button = ({ id, children, style, ref }: PropsWithId) => {
  const active = useActive(id);

  return (
    <styledElements.styledButton
      className={active}
      styles={style}
      ref={ref as unknown as RefObject<HTMLButtonElement>}
    >
      {children}
    </styledElements.styledButton>
  );
};

export default Button;
