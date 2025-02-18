import { add100PerToStyle } from "@/utils/Helpers";
import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";

const Container = ({ id, style }: PropsWithId) => {
  const active = useActive(id);
  const added = add100PerToStyle(style);
  return <hr className={active} style={added} />;
};

export default Container;
