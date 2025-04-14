import { selectActive, useAppSelector } from "@/redux/hooks";
import SizingAndBorder from "./SizingAndBorder";
import Source from "./Source";
import Text from "./Text/Text";
import Url from "./Url";
import Background from "./Background/Background";
import Alignment from "./Alignment";
import ContainerSettings from "./ContainerSettings";
import IconType from "./IconType";
import Animations from "./Animations";
import FixedSettings from "./FixedSettings";

const ElementSettings = () => {
  const active = useAppSelector(selectActive);
  const activeType = active?.type;
  const activeId = active?.id;
  const shouldHaveSource =
    activeType === "audio" || activeType === "image" || activeType === "video";
  const isText = activeType === "text";
  const shouldHaveUrl = activeType === "button";
  const shouldHaveAlignment =
    activeType === "column" ||
    activeType === "container" ||
    activeType === "fixed" ||
    activeType === "button" ||
    activeType === "row";
  const isContainer = activeType === "container";
  const isIcon = activeType === "icon";
  const isFixed = activeType === "fixed";

  return (
    <div className="m-2">
      <h1 className="font-bold text-xl text-center mb-2">
        Settings For The Selected Element
      </h1>

      {!isContainer && <SizingAndBorder />}
      {isContainer && <ContainerSettings />}
      {isFixed && <FixedSettings />}
      <Background />
      {shouldHaveAlignment && <Alignment />}
      <Animations />
      {shouldHaveSource && <Source />}
      {isIcon && <IconType />}
      {shouldHaveUrl && <Url />}
      {isText && <Text key={activeId} />}
    </div>
  );
};

export default ElementSettings;
