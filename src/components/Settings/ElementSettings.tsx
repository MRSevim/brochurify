import { useAppSelector } from "@/redux/hooks";
import SizingAndBorder from "./SizingAndBorder";
import Source from "./Source";

const ElementSettings = () => {
  const activeType = useAppSelector((state) => state.editor.active?.type);
  const shouldHaveSource =
    activeType === "audio" || activeType === "image" || activeType === "video";
  return (
    <div className="m-2">
      <h1 className="font-bold text-xl text-light text-center mb-2">
        Settings For The Selected Element
      </h1>

      <SizingAndBorder />
      {shouldHaveSource && <Source />}
    </div>
  );
};

export default ElementSettings;
