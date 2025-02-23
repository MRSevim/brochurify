import useActive from "@/utils/hooks/useActive";
import { PropsWithId } from "@/utils/Types";
import { styledElements } from "@/utils/Helpers";

const Container = ({ id, style, iconType }: PropsWithId) => {
  const active = useActive(id);

  return (
    <styledElements.styledI
      className={active + ` bi bi-${iconType}`}
      styles={style}
    />
  );
};

export default Container;
