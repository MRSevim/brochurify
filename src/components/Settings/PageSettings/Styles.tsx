import BottomLine from "@/components/BottomLine";
import ColorPicker from "@/components/ColorPicker";
import ResetButton from "@/components/ResetButton";
import Select from "@/components/Select";
import Slider from "@/components/Slider";
import ToggleVisibilityWrapper from "@/components/ToggleVisibilityWrapper";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { changeElementStyle } from "@/redux/slices/editorSlice";
import {
  fontOptions,
  getFontVariables,
  getPageWise,
  getSetting,
} from "@/utils/Helpers";
import HeadingStyles from "./HeadingStyles";

const Styles = () => {
  return (
    <ToggleVisibilityWrapper
      title="Styles"
      desc="Settings to edit the look of the whole page"
    >
      <Color />
      <BackgroundColor />
      <FontSize />
      <FontFamily />
      <LineHeight />
      <HeadingStyles />
    </ToggleVisibilityWrapper>
  );
};

const Color = () => {
  const type = "color";
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();

  return (
    <div className="relative pb-2 mb-2">
      <ColorPicker
        onVarSelect={(param) =>
          dispatch(
            changeElementStyle({
              type,
              newValue: param,
            })
          )
        }
        title={"Select pagewise text color"}
        selected={variable || "#000000"}
        onChange={(newValue) =>
          dispatch(
            changeElementStyle({
              type,
              newValue,
            })
          )
        }
      />
      <ResetButtonWithOnClick type={type} />
      <BottomLine />
    </div>
  );
};
const BackgroundColor = () => {
  const type = "background-color";
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();

  return (
    <div className="relative pb-2 mb-2">
      <ColorPicker
        onVarSelect={(param) =>
          dispatch(
            changeElementStyle({
              type,
              newValue: param,
            })
          )
        }
        title="Select pagewise background color"
        selected={variable || "#000000"}
        onChange={(newValue) =>
          dispatch(
            changeElementStyle({
              type,
              newValue,
            })
          )
        }
      />
      <ResetButtonWithOnClick type={type} />
      <BottomLine />
    </div>
  );
};
const FontSize = () => {
  const type = "font-size";
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();

  return (
    <div className="relative pb-2 mb-2">
      <Slider
        title="Select pagewise font size"
        max={70}
        step={1}
        units={["px"]}
        value={variable || "16px"}
        onChange={(newValue) =>
          dispatch(
            changeElementStyle({
              type,
              newValue,
            })
          )
        }
      />
      <ResetButtonWithOnClick type={type} />
      <BottomLine />
    </div>
  );
};

const FontFamily = () => {
  const type = "font-family";
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();
  const fontVariables = getFontVariables(useAppSelector);

  return (
    <div className="relative pb-2 mb-2">
      <Select
        title="Select pagewise font family"
        showStyled={true}
        options={[...fontOptions, ...fontVariables]}
        selected={variable || ""}
        onChange={(e) => {
          dispatch(
            changeElementStyle({
              type,
              newValue: e.target.value,
            })
          );
        }}
      />
      <ResetButtonWithOnClick type={type} />
      <BottomLine />
    </div>
  );
};

const LineHeight = () => {
  const type = "line-height";
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();

  return (
    <div className="relative pb-2 mb-2">
      <Slider
        title="Select pagewise line-height"
        max={5}
        units={["", "px", "em", "%"]}
        step={0.1}
        value={variable || "1.5"}
        onChange={(newValue) =>
          dispatch(
            changeElementStyle({
              type,
              newValue,
            })
          )
        }
      />
      <ResetButtonWithOnClick type={type} />
      <BottomLine />
    </div>
  );
};

export const ResetButtonWithOnClick = ({ type }: { type: string }) => {
  const dispatch = useAppDispatch();

  return (
    <ResetButton
      onClick={() => {
        dispatch(
          changeElementStyle({
            type,
            newValue: (getPageWise()[type] as string) || "",
          })
        );
      }}
    />
  );
};
export default Styles;
