import { selectActive, useAppSelector } from "@/redux/hooks";
import SizingAndBorder from "./SizingAndBorder";
import Source from "./Source";
import Text from "./Text/Text";
import Url from "./Url";
import Background from "./Background";
import Alignment from "./PageSettings/Alignment";
import ContainerSettings from "./ContainerSettings";
import IconType from "./IconType";
import Animations from "./Animations";

const ElementSettings = () => {
  const active = useAppSelector(selectActive);
  const activeType = active?.type;
  const shouldHaveSource =
    activeType === "audio" || activeType === "image" || activeType === "video";
  const isText = activeType === "text";
  const shouldHaveUrl = activeType === "button" || activeType === "icon";
  const shouldHaveAlignment = activeType === "row";
  const isContainer = activeType === "container";
  const isIcon = activeType === "icon";

  return (
    <div className="m-2">
      <h1 className="font-bold text-xl text-light text-center mb-2">
        Settings For The Selected Element
      </h1>

      {!isContainer && <SizingAndBorder />}
      {isContainer && <ContainerSettings />}
      <Background />
      {shouldHaveSource && <Source />}
      {isText && <Text />}
      {shouldHaveUrl && <Url />}
      {shouldHaveAlignment && <Alignment />}
      {isIcon && <IconType />}
      <Animations />
    </div>
  );
};

export default ElementSettings;
