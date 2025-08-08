import { selectActiveType, useAppSelector } from "@/redux/hooks";
import SizingAndBorder from "./SizingAndBorder";
import Source from "./Source";
import Url from "./Url";
import Background from "./Background/Background";
import Alignment from "./Alignment";
import ContainerSettings from "./ContainerSettings";
import IconType from "./IconType";
import FixedSettings from "./FixedSettings";
import Anchor from "./Anchor";
import Others from "./Others";
import Transitions from "./Transitions/Transitions";
import TextRelated from "./Text/TextRelated";

const ElementSettings = () => {
  const activeType = useAppSelector(selectActiveType);
  const shouldHaveSource =
    activeType === "audio" || activeType === "image" || activeType === "video";
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
      <Transitions />
      {shouldHaveSource && <Source />}
      {isIcon && <IconType />}
      <Anchor />
      <Others />
      <TextRelated />
      {shouldHaveUrl && <Url />}
    </div>
  );
};

export default ElementSettings;
