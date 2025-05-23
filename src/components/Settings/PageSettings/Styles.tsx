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
import InfoIcon from "@/components/InfoIcon";
import ToggleBtn from "@/components/ToggleBtn";
import { CONFIG } from "@/utils/Types";

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
      <ToggleToBrowserDefaults />
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
        title={"Select pagewise text color"}
        selected={variable || "#000000"}
        onChange={(newValue) =>
          dispatch(
            changeElementStyle({
              types: [type],
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
        title="Select pagewise background color"
        selected={variable || "#000000"}
        onChange={(newValue) =>
          dispatch(
            changeElementStyle({
              types: [type],
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
        step={1}
        units={["px"]}
        value={variable || "16px"}
        onChange={(newValue) =>
          dispatch(
            changeElementStyle({
              types: [type],
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
        options={[...fontVariables, ...fontOptions]}
        selected={variable || ""}
        onChange={(e) => {
          dispatch(
            changeElementStyle({
              types: [type],
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
              types: [type],
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

const ToggleToBrowserDefaults = () => {
  const initial = "initial";
  const fontWeigthHeading = getSetting(
    useAppSelector,
    CONFIG.headings,
    "font-weight"
  );
  const fontSizeHeading = getSetting(
    useAppSelector,
    CONFIG.headings,
    "font-size"
  );
  const linkColor = getSetting(useAppSelector, "a", "color");
  const linkTextDecoration = getSetting(useAppSelector, "a", "text-decoration");
  const toggled =
    fontWeigthHeading === initial &&
    fontSizeHeading === initial &&
    linkColor === initial &&
    linkTextDecoration === initial;

  const dispatch = useAppDispatch();
  const setTo = (newValue: string) => {
    dispatch(
      changeElementStyle({
        types: [CONFIG.headings, "font-weight"],
        newValue,
      })
    );
    dispatch(
      changeElementStyle({
        types: [CONFIG.headings, "font-size"],
        newValue,
      })
    );
    dispatch(
      changeElementStyle({
        types: ["a", "color"],
        newValue,
      })
    );
    dispatch(
      changeElementStyle({
        types: ["a", "text-decoration"],
        newValue,
      })
    );
  };

  const handleToggle = () => {
    if (!toggled) {
      setTo(initial);
    } else {
      setTo("");
    }
  };

  return (
    <div className="relative pb-2 mb-2">
      <div className="flex justify-between mb-2">
        <ToggleBtn
          text="Use browser defaults for link+headings"
          checked={toggled}
          onChange={handleToggle}
        />
        <InfoIcon text="Toggle to reset link and heading styles to browser defaults" />
      </div>
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
            types: [type],
            newValue: (getPageWise()[type] as string) || "",
          })
        );
      }}
    />
  );
};
export default Styles;
