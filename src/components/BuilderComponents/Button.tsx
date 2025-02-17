import { add100PerToStyle } from "@/utils/Helpers";
import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";

const Button = ({ href, newTab, id, children, style }: PropsWithId) => {
  const active = useActive(id);
  const added = add100PerToStyle(style);
  const inner = (
    <button className={active} style={added}>
      {children}
    </button>
  );
  return (
    <>
      {href && (
        <a href={href} target={newTab ? "_blank" : "_self"}>
          {inner}
        </a>
      )}
      {!href && <>{inner}</>}
    </>
  );
};

export default Button;
