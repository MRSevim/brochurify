import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/Helpers";

const Button = ({ id, children, style }: PropsWithId) => {
  const active = useActive(id);

  return (
    <styledElements.styledButton className={active} styles={style}>
      {children}
    </styledElements.styledButton>
  );
};

export default Button;
