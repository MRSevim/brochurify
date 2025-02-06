import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import BottomLine from "../BottomLine";
import ToggleVisibilityWrapper from "../ToggleVisibilityWrapper";
import { getProp, getSetting } from "@/utils/Helpers";
import LinkInput from "../LinkInput";
import { changeElementProp } from "@/redux/slices/editorSlice";
import TextInput from "../TextInput";

const Source = () => {
  const activeType = useAppSelector((state) => state.editor.active?.type);
  return (
    <ToggleVisibilityWrapper title="Source">
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
