import { add100PerHeightToStyle } from "@/utils/Helpers";
import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";

const Column = ({ id, children, style }: PropsWithId) => {
  const active = useActive(id);
  const added = add100PerHeightToStyle(style);
  return (
    <div className={active} style={{ ...added, width: "100%" }}>
      {children}
    </div>
  );
};

export default Column;
