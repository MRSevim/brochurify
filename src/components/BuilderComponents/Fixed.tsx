import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/Helpers";

const Fixed = ({ id, children, style }: PropsWithId) => {
  const active = useActive(id, true);
  return (
    <styledElements.styledFixed className={active} styles={style}>
      {children}
    </styledElements.styledFixed>
  );
};

export default Fixed;
