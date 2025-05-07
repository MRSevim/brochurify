import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import ToggleVisibilityWrapper from "../ToggleVisibilityWrapper";
import BottomLine from "../BottomLine";
import { WidthAndHeight } from "./SizingAndBorder";
import NumberInput from "../NumberInput";
import {
  getDefaultStyle,
  getSetting,
  getValueFromShorthandStr,
  setValueFromShorthandStr,
} from "@/utils/Helpers";
import { changeElementStyle } from "@/redux/slices/editorSlice";
import Slider from "../Slider";
import ResetButton from "../ResetButton";

const ContainerSettings = () => {
  return (
    <ToggleVisibilityWrapper title="Container Settings">
      <WidthAndHeight />
      <MaxWidth />
      <Padding />
    </ToggleVisibilityWrapper>
  );
};

const MaxWidth = () => {
  const type = "max-width";
  const dispatch = useAppDispatch();
  const variable = getSetting(useAppSelector, type);
  return (
    <div className="relative pb-2 mb-2">
      <NumberInput
        title="Maximum width of the container (in pixels)"
        value={variable || ""}
        onChange={(e) =>
          dispatch(
            changeElementStyle({ type, newValue: +e.target.value + "px" })
          )
        }
      />
      <ResetButton
        onClick={() =>
          dispatch(
            changeElementStyle({
              type,
              newValue:
                getDefaultStyle("container")["max-width"] || "1300" + "px",
            })
          )
        }
      />
      <BottomLine />
    </div>
  );
};
const Padding = () => {
  const type = "padding";
  const dispatch = useAppDispatch();
  const variable = getSetting(useAppSelector, type);
  const i = 1;

  return (
    <div className="relative pb-2 mb-2">
      <Slider
        key={i}
        value={getValueFromShorthandStr(variable, i)}
        title="Horizontal padding"
        onChange={(e) =>
          dispatch(
            changeElementStyle({
              type,
              newValue: setValueFromShorthandStr(variable, i, e),
            })
          )
        }
      />
      <ResetButton
        onClick={() => {
          dispatch(
            changeElementStyle({
              type,
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
      <BottomLine />
    </div>
  );
};

export default ContainerSettings;
