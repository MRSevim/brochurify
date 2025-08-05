import ToggleVisibilityWrapper from "@/components/ToggleVisibilityWrapper";
import {
  selectActive,
  selectActiveType,
  selectPageWise,
  useAppDispatch,
  useAppSelector,
} from "@/redux/hooks";
import Text from "./Text";
import ResetButton from "@/components/ResetButton";
import { convertVarIdToVarName, getSetting } from "@/utils/Helpers";
import Slider from "@/components/Slider";
import { changeElementStyle } from "@/redux/slices/editorSlice";
import ColorPicker from "@/components/ColorPicker";
import FontFamilyPicker from "@/components/FontFamilyPicker";
import WrapperWithBottomLine from "@/components/WrapperWithBottomLine";
import VariableSelector from "@/components/VariableSelector";

const TextRelated = () => {
  const activeId = useAppSelector(selectActive);
  const activeType = useAppSelector(selectActiveType);
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
  const activeType = useAppSelector(selectActiveType);
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

const type = "font-size";
const FontSize = () => {
  const variable = getSetting(useAppSelector, type);
  const pageWise = useAppSelector(selectPageWise);
  const dispatch = useAppDispatch();

  return (
    <WrapperWithBottomLine>
      <FontSizePicker
        variable={variable || pageWise[type] || "16px"}
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

export const FontSizePicker = ({
  variable,
  variablesAvailable = true,
  onChange,
}: {
  variable: string;
  variablesAvailable?: boolean;
  onChange: (e: string) => void;
}) => {
  const sliderValue = convertVarIdToVarName(variable || "", useAppSelector);
  return (
    <>
      <Slider
        value={sliderValue}
        title="Pick a font size"
        step={1}
        onChange={onChange}
      />
      {variablesAvailable && (
        <VariableSelector
          selected={variable || ""}
          type={type}
          onChange={(value) => onChange(value)}
        />
      )}
    </>
  );
};
export default TextRelated;
