import { useAppSelector } from "@/redux/hooks";
import SizingAndBorder from "./SizingAndBorder";
import Source from "./Source";
import Text from "./Text/Text";

const ElementSettings = () => {
  const activeType = useAppSelector((state) => state.editor.active?.type);
  const shouldHaveSource =
    activeType === "audio" || activeType === "image" || activeType === "video";
  const shouldHaveText = activeType === "text";
  return (
    <div className="m-2">
      <h1 className="font-bold text-xl text-light text-center mb-2">
        Settings For The Selected Element
      </h1>

      <SizingAndBorder />
      {shouldHaveSource && <Source />}
      {shouldHaveText && <Text />}
    </div>
  );
};

export default ElementSettings;
