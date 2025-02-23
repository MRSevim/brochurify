import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/Helpers";

const Container = ({ id, style }: PropsWithId) => {
  const active = useActive(id);

  return <styledElements.styledHr className={active} styles={style} />;
};

export default Container;
