import { useAppSelector } from "@/redux/hooks";
import SizingAndBorder from "./SizingAndBorder";
import Source from "./Source";
import Text from "./Text/Text";
import Url from "./Url";
import Background from "./Background";
import Alignment from "./PageSettings/Alignment";

const ElementSettings = () => {
  const active = useAppSelector((state) => state.editor.active);
  const activeType = active?.type;
  const activeId = active?.id;
  const shouldHaveSource =
    activeType === "audio" || activeType === "image" || activeType === "video";
  const shouldHaveText = activeType === "text";
  const shouldHaveUrl = activeType === "button" || activeType === "icon";
  const shouldHaveAlignment = activeType === "row";
  return (
    <div className="m-2">
      <h1 className="font-bold text-xl text-light text-center mb-2">
        Settings For The Selected Element
      </h1>

      <SizingAndBorder />
      <Background />
      {shouldHaveSource && <Source />}
      {shouldHaveText && <Text key={activeId} />}
      {shouldHaveUrl && <Url />}
      {shouldHaveAlignment && <Alignment />}
    </div>
  );
};

export default ElementSettings;
