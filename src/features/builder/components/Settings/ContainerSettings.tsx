import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import ToggleVisibilityWrapper from "../../../../../components/ToggleVisibilityWrapper";
import { WidthAndHeight } from "./SizingAndBorder";
import {
  getDefaultStyle,
  getSetting,
  getValueFromShorthandStr,
  setValueFromShorthandStr,
} from "@/utils/Helpers";
import { changeElementStyle } from "@/features/builder/lib/redux/slices/editorSlice";
import Slider from "../../../../../components/Slider";
import ResetButton from "../../../../../components/ResetButton";
import WrapperWithBottomLine from "../../../../../components/WrapperWithBottomLine";

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
