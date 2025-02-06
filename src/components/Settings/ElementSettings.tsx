import { useAppSelector } from "@/redux/hooks";
import SizingAndBorder from "./SizingAndBorder";
import Source from "./Source";
import Text from "./Text/Text";
import Url from "./Url";

const ElementSettings = () => {
  const activeType = useAppSelector((state) => state.editor.active?.type);
  const shouldHaveSource =
    activeType === "audio" || activeType === "image" || activeType === "video";
  const shouldHaveText = activeType === "text";
  const shouldHaveUrl = activeType === "button" || activeType === "icon";
  return (
    <div className="m-2">
      <h1 className="font-bold text-xl text-light text-center mb-2">
        Settings For The Selected Element
      </h1>

      <SizingAndBorder />
      {shouldHaveSource && <Source />}
      {shouldHaveText && <Text />}
      {shouldHaveUrl && <Url />}
    </div>
  );
};

export default ElementSettings;
