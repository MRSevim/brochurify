import useClasses from "@/features/builder/utils/hooks/useClasses";
import { styledElements } from "@/features/builder/utils/StyledComponents";
import { TextPropsForRendering } from "@/features/builder/utils/types/propTypes.d";

const Text = ({ text, style, ref }: TextPropsForRendering) => {
  const active = useClasses();

  return (
    <styledElements.styledP
      ref={ref}
      className={active}
      $styles={style}
      dangerouslySetInnerHTML={{ __html: text || "" }}
    ></styledElements.styledP>
  );
};

export default Text;
