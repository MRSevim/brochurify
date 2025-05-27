import ToggleVisibilityWrapper from "@/components/ToggleVisibilityWrapper";
import {
  selectActive,
  selectPageWise,
  useAppDispatch,
  useAppSelector,
} from "@/redux/hooks";
import Text from "./Text";
import ResetButton from "@/components/ResetButton";
import { getSetting } from "@/utils/Helpers";
import Slider from "@/components/Slider";
import { changeElementStyle } from "@/redux/slices/editorSlice";
import ColorPicker from "@/components/ColorPicker";
import FontFamilyPicker from "@/components/FontFamilyPicker";
import WrapperWithBottomLine from "@/components/WrapperWithBottomLine";

const TextRelated = () => {
  const active = useAppSelector(selectActive);
  const activeId = active?.id;
  const activeType = active?.type;
  const isText = activeType === "text";
  return (
    <ToggleVisibilityWrapper
      title="Text Related"
      desc="Applies to all text inside this element (including icons)"
    >
      <TextColor />
      <FontFamily />
      <FontSize />
      {isText && <Text key={activeId} />}
    </ToggleVisibilityWrapper>
  );
};
const TextColor = () => {
  const type = "color";
  const pageWise = useAppSelector(selectPageWise);
  const activeType = useAppSelector(selectActive)?.type;
  const colorStr = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();
  return (
    <WrapperWithBottomLine>
      <ColorPicker
        title={`Pick ${activeType === "icon" ? "icon" : "text"} color`}
        selected={colorStr || pageWise.color || "#000000"}
        onChange={(newValue) =>
          dispatch(changeElementStyle({ types: [type], newValue }))
        }
      />
      <ResetButton
        onClick={() => {
          dispatch(changeElementStyle({ types: [type], newValue: "" }));
        }}
      />
    </WrapperWithBottomLine>
  );
};

const FontFamily = () => {
  const type = "font-family";
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();

  return (
    <WrapperWithBottomLine>
      <FontFamilyPicker
        variable={variable}
        onChange={(newValue) => {
          dispatch(
            changeElementStyle({
              types: [type],
              newValue,
            })
          );
        }}
      />
      <ResetButton
        onClick={() => {
          dispatch(changeElementStyle({ types: [type], newValue: "" }));
        }}
      />
    </WrapperWithBottomLine>
  );
};

const FontSize = () => {
  const type = "font-size";
  const variable = getSetting(useAppSelector, type);
  const pageWise = useAppSelector(selectPageWise);
  const dispatch = useAppDispatch();

  return (
    <WrapperWithBottomLine>
      <Slider
        title="Pick a font size"
        step={1}
        value={variable || pageWise[type] || "16px"}
        onChange={(newValue) => {
          dispatch(
            changeElementStyle({
              types: [type],
              newValue,
            })
          );
        }}
      />
      <ResetButton
        onClick={() => {
          dispatch(changeElementStyle({ types: [type], newValue: "" }));
        }}
      />
    </WrapperWithBottomLine>
  );
};
export default TextRelated;
