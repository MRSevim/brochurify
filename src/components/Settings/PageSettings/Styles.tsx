import BottomLine from "@/components/BottomLine";
import ColorPicker from "@/components/ColorPicker";
import ResetButton from "@/components/ResetButton";
import Select from "@/components/Select";
import Slider from "@/components/Slider";
import SmallText from "@/components/SmallText";
import ToggleVisibilityWrapper from "@/components/ToggleVisibilityWrapper";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { changeElementStyle } from "@/redux/slices/editorSlice";
import {
  fontOptions,
  getFontVariables,
  getPageWise,
  getSetting,
} from "@/utils/Helpers";

const Styles = () => {
  return (
    <ToggleVisibilityWrapper title="Styles">
      <SmallText>Settings to edit the look of the overall page</SmallText>
      <Color />
      <BackgroundColor />
      <FontSize />
      <FontFamily />
      <LineHeight />
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
        onChange={(e) =>
          dispatch(
            changeElementStyle({
              type,
              newValue: e.target.value,
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
        onChange={(e) =>
          dispatch(
            changeElementStyle({
              type,
              newValue: e.target.value,
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
        parse={true}
        title="Pick pagewise font size"
        min={1}
        max={70}
        step={1}
        value={variable || "16px"}
        onChange={(e) =>
          dispatch(
            changeElementStyle({
              type,
              newValue: e.target.value + "px",
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
        title="Pick pagewise font family"
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
        parse={false}
        title="Pick pagewise line-height"
        min={1}
        max={5}
        step={0.5}
        value={variable || "1.5"}
        onChange={(e) =>
          dispatch(
            changeElementStyle({
              type,
              newValue: e.target.value,
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
            newValue: getPageWise()[type] || "",
          })
        );
      }}
    />
  );
};
export default Styles;
