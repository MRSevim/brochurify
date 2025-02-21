import { add100PerToStyle } from "@/utils/Helpers";
import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";

const Button = ({ href, newTab, id, children, style }: PropsWithId) => {
  const active = useActive(id);
  const added = add100PerToStyle(style);
  return (
    <button className={active} style={added}>
      {children}
    </button>
  );
};

export default Button;
