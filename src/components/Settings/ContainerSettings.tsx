import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import ToggleVisibilityWrapper from "../ToggleVisibilityWrapper";
import BottomLine from "../BottomLine";
import { WidthAndHeight } from "./SizingAndBorder";
import NumberInput from "../NumberInput";
import {
  getSetting,
  getValueFromShorthandStr,
  setValueFromShorthandStr,
} from "@/utils/Helpers";
import { changeElementStyle } from "@/redux/slices/editorSlice";
import Slider from "../Slider";

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
        title="Maximum width of the container"
        value={variable || ""}
        onChange={(e) =>
          dispatch(
            changeElementStyle({ type, newValue: +e.target.value + "px" })
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
        parse={true}
        key={i}
        value={getValueFromShorthandStr(variable, i)}
        min={0}
        max={50}
        step={2}
        title="Horizontal padding"
        onChange={(e) =>
          dispatch(
            changeElementStyle({
              type,
              newValue: setValueFromShorthandStr(
                variable,
                i,
                e.target.value + "px"
              ),
            })
          )
        }
      />

      <BottomLine />
    </div>
  );
};

export default ContainerSettings;
