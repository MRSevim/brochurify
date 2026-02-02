import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import ToggleVisibilityWrapper from "../ToggleVisibilityWrapper";
import LinkInput from "@/components/LinkInput";
import { changeElementProp } from "@/features/builder/lib/redux/slices/editorSlice";
import TextInput from "@/components/TextInput";
import WrapperWithBottomLine from "../WrapperWithBottomLine";
import UploadWrapper from "./UploadWrapper";
import { selectActiveType } from "../../lib/redux/selectors";
import { getProp } from "../../utils/helpers";

const Source = () => {
  const activeType = useAppSelector(selectActiveType);

  return (
    <ToggleVisibilityWrapper title="Source" desc="Add the source of your media">
      <SourceUrl />
      {activeType === "image" && <AltText />}
    </ToggleVisibilityWrapper>
  );
};

const SourceUrl = () => {
  const type = "src";
  const activeType = useAppSelector(selectActiveType);
  const variable = getProp<string>(useAppSelector, type);
  const dispatch = useAppDispatch();

  const Inner = (
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
          }),
        )
      }
    />
  );

  return (
    <>
      {activeType === "image" ? (
        <UploadWrapper
          onEditOrAdd={(newValue) => {
            dispatch(
              changeElementProp({
                type,
                newValue,
              }),
            );
          }}
        >
          {Inner}
        </UploadWrapper>
      ) : (
        <>{Inner}</>
      )}
    </>
  );
};

const AltText = () => {
  const type = "alt";
  const variable = getProp<string>(useAppSelector, type);
  const dispatch = useAppDispatch();

  return (
    <WrapperWithBottomLine>
      <TextInput
        title="Alternative text (accessibility)"
        desc="Add a text to this image that will be used by screen readers and will be visible if image is not available"
        value={variable || ""}
        onChange={(e) =>
          dispatch(
            changeElementProp({
              type,
              newValue: e.target.value,
            }),
          )
        }
      />
    </WrapperWithBottomLine>
  );
};

export default Source;
