import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";

const Button = ({ href, newTab, id, children, style }: PropsWithId) => {
  const active = useActive(id);
  const inner = (
    <button className={active} style={style}>
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
