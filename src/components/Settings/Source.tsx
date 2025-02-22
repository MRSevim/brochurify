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
    <ToggleVisibilityWrapper title="Source">
      <SmallText>Add source for your media</SmallText>
      {activeType === "image" && (
        <SmallText>
          Should be apng, avif, gif, jpeg, png (recommended), svg or webp
          (recommended)
        </SmallText>
      )}
      {activeType === "video" && (
        <SmallText> Should be mp4, webm or ogg</SmallText>
      )}
      {activeType === "audio" && (
        <SmallText> Should be mp3, wav or ogg</SmallText>
      )}
      <SourceUrl />
      {activeType === "image" && <AltText />}
    </ToggleVisibilityWrapper>
  );
};

const SourceUrl = () => {
  const type = "src";
  const variable = getProp<string>(useAppSelector, type);
  const dispatch = useAppDispatch();
  return (
    <div className="relative pb-2 mb-2">
      <LinkInput
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
