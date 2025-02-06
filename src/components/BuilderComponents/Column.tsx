import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";

const Column = ({ id, children, style }: PropsWithId) => {
  const active = useActive(id);
  return (
    <div className={active} style={style}>
      {children}
    </div>
  );
};

export default Column;
