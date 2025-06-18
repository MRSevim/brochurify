import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import ToggleVisibilityWrapper from "../ToggleVisibilityWrapper";
import { WidthAndHeight } from "./SizingAndBorder";
import {
  getDefaultStyle,
  getSetting,
  getValueFromShorthandStr,
  setValueFromShorthandStr,
} from "@/utils/Helpers";
import { changeElementStyle } from "@/redux/slices/editorSlice";
import Slider from "../Slider";
import ResetButton from "../ResetButton";
import WrapperWithBottomLine from "../WrapperWithBottomLine";

const ContainerSettings = () => {
  return (
    <ToggleVisibilityWrapper title="Container Settings">
      <WidthAndHeight />
      <Padding />
    </ToggleVisibilityWrapper>
  );
};

const Padding = () => {
  const type = "padding";
  const dispatch = useAppDispatch();
  const variable = getSetting(useAppSelector, type);
  const i = 1;

  return (
    <WrapperWithBottomLine>
      <Slider
        key={i}
        value={getValueFromShorthandStr(variable, i)}
        title="Horizontal padding"
        onChange={(e) =>
          dispatch(
            changeElementStyle({
              types: [type],
              newValue: setValueFromShorthandStr(variable, i, e),
            })
          )
        }
      />
      <ResetButton
        onClick={() => {
          dispatch(
            changeElementStyle({
              types: [type],
              newValue:
                setValueFromShorthandStr(
                  getDefaultStyle("container").padding,
                  i,
                  getValueFromShorthandStr(
                    getDefaultStyle("container").padding,
                    i
                  )
                ) || "0 12" + "px",
            })
          );
        }}
      />
    </WrapperWithBottomLine>
  );
};

export default ContainerSettings;
