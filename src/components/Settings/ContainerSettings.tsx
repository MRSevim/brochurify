import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import SmallText from "../SmallText";
import ToggleVisibilityWrapper from "../ToggleVisibilityWrapper";
import BottomLine from "../BottomLine";
import { NumberController } from "./SizingAndBorder";
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
      <Height />
      <MaxWidth />
      <Padding />
    </ToggleVisibilityWrapper>
  );
};
const Height = () => {
  const activeId = useAppSelector((state) => state.editor.active?.id);
  return (
    <div className="relative pb-2 mb-2">
      <SmallText>
        Pixel, percentage based width for the element, also automatic option
      </SmallText>
      <div className="flex gap-2" key={activeId}>
        <NumberController type="height" />
      </div>
      <BottomLine />
    </div>
  );
};
const MaxWidth = () => {
  const type = "maxWidth";
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
