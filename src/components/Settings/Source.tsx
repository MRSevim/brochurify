import { selectActive, useAppDispatch, useAppSelector } from "@/redux/hooks";
import BottomLine from "../BottomLine";
import ToggleVisibilityWrapper from "../ToggleVisibilityWrapper";
import { getProp, getSetting } from "@/utils/Helpers";
import LinkInput from "../LinkInput";
import { changeElementProp } from "@/redux/slices/editorSlice";
import TextInput from "../TextInput";
import SmallText from "../SmallText";

const Source = () => {
  const activeType = useAppSelector(selectActive)?.type;
  return (
    <ToggleVisibilityWrapper title="Source" desc="Add the source of your media">
      <SourceUrl />
      {activeType === "image" && <AltText />}
    </ToggleVisibilityWrapper>
  );
};

const SourceUrl = () => {
  const type = "src";
  const activeType = useAppSelector(selectActive)?.type;
  const variable = getProp<string>(useAppSelector, type);
  const dispatch = useAppDispatch();
  return (
    <div className="relative pb-2 mb-2">
      <LinkInput
        desc={
          activeType === "image"
            ? "should be apng, avif, gif, jpeg, png (recommended), svg or webp (recommended)"
            : activeType === "video"
            ? "should be mp4, webm or ogg"
            : activeType === "audio"
            ? "should be mp3, wav or ogg"
            : ""
        }
        title="Source url"
        value={variable || ""}
        onChange={(e) =>
          dispatch(
            changeElementProp({
              type,
              newValue: e.target.value,
            })
          )
        }
      />
      <BottomLine />
    </div>
  );
};
const AltText = () => {
  const type = "alt";
  const variable = getProp<string>(useAppSelector, type);
  const dispatch = useAppDispatch();
  return (
    <div className="relative pb-2 mb-2">
      <TextInput
        title="Alternative text (accessibility)"
        desc="Add a text to this image that will be used by screen readers and will be visible if image is not available"
        value={variable || ""}
        onChange={(e) =>
          dispatch(
            changeElementProp({
              type,
              newValue: e.target.value,
            })
          )
        }
      />
      <BottomLine />
    </div>
  );
};
export default Source;
