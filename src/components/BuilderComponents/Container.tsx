import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/Helpers";

const Container = ({ id, children, style }: PropsWithId) => {
  const active = useActive(id);

  return (
    <styledElements.styledDiv className={active} styles={style}>
      {children}
    </styledElements.styledDiv>
  );
};

export default Container;
