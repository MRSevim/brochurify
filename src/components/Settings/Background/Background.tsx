import {
  extractUrlValue,
  getSetting,
  getValueFromShorthandStr,
  setValueFromShorthandStr,
} from "@/utils/Helpers";
import ToggleVisibilityWrapper from "../../ToggleVisibilityWrapper";
import { selectPageWise, useAppDispatch, useAppSelector } from "@/redux/hooks";
import ColorPicker from "../../ColorPicker";
import { changeElementStyle } from "@/redux/slices/editorSlice";
import SecondaryTitle from "../../SecondaryTitle";
import ToggleBtn from "../../ToggleBtn";
import LinkInput from "../../LinkInput";
import Select from "../../Select";
import ResetButton from "../../ResetButton";
import Slider from "../../Slider";
import { BackgroundPositionPicker } from "./BackgroundPositionPicker";
import { CONFIG, StringOrUnd } from "@/utils/Types";
import WrapperWithBottomLine from "@/components/WrapperWithBottomLine";
import UploadWrapper from "../UploadWrapper";

const Background = () => {
  return (
    <ToggleVisibilityWrapper title="Background">
      <BackgroundColor />
      <BackgroundImage />
      <BackgroundShadow />
    </ToggleVisibilityWrapper>
  );
};

const type = "background-color";

export const BackgroundColor = () => {
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();

  return (
    <WrapperWithBottomLine>
      <BackgroundColorPicker
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
          dispatch(
            changeElementStyle({
              types: [type],
              newValue: "",
            })
          );
        }}
      />
    </WrapperWithBottomLine>
  );
};

const BackgroundColorPicker = ({
  variable,
  onChange,
}: {
  variable: StringOrUnd;
  onChange: (newVal: string) => void;
}) => {
  const pageWise = useAppSelector(selectPageWise);
  return (
    <ColorPicker
      title="Select background color"
      selected={variable || pageWise[type] || "#ffffff"}
      onChange={(newValue) => {
        onChange(newValue);
      }}
    />
  );
};
const BackgroundShadow = () => {
  const type = "box-shadow";
  const variable = getSetting(useAppSelector, type);
  const pageWise = useAppSelector(selectPageWise);
  const toggled = !!variable;
  const dispatch = useAppDispatch();

  const setToInitial = () =>
    dispatch(
      changeElementStyle({
        types: [type],
        newValue: "5px 5px 5px 2px " + pageWise.color || "#000000",
      })
    );
  const handleToggle = () => {
    if (!toggled) {
      setToInitial();
    } else {
      dispatch(
        changeElementStyle({
          types: [type],
          newValue: "",
        })
      );
    }
  };
  const handleChange = (e: string, i: number) => {
    dispatch(
      changeElementStyle({
        types: [type],
        newValue: setValueFromShorthandStr(variable, i, e),
      })
    );
  };
  return (
    <WrapperWithBottomLine>
      <SecondaryTitle title="Background Shadow">
        <ToggleBtn checked={toggled} onChange={handleToggle} />
      </SecondaryTitle>
      {toggled && (
        <>
          <BackgroundShadowSlider
            value={getValueFromShorthandStr(variable, 0)}
            title="Horizontal offset"
            onChange={(e) => handleChange(e, 0)}
          />
          <BackgroundShadowSlider
            value={getValueFromShorthandStr(variable, 1)}
            title="Vertical offset"
            onChange={(e) => handleChange(e, 1)}
          />
          <BackgroundShadowSlider
            value={getValueFromShorthandStr(variable, 2)}
            title="Blur"
            onChange={(e) => handleChange(e, 2)}
          />
          <BackgroundShadowSlider
            value={getValueFromShorthandStr(variable, 3)}
            title="Spread radius"
            onChange={(e) => handleChange(e, 3)}
          />
          <ColorPicker
            title="Shadow color"
            selected={getValueFromShorthandStr(variable, 4)}
            onChange={(e) => handleChange(e, 4)}
          />
          <ResetButton onClick={() => setToInitial()} />
        </>
      )}
    </WrapperWithBottomLine>
  );
};

const BackgroundShadowSlider = ({
  value,
  title,
  onChange,
}: {
  value: string;
  title: string;
  onChange: (e: string) => void;
}) => {
  return (
    <Slider
      min={title === "Blur" ? 0 : -50}
      step={1}
      value={value}
      title={title}
      onChange={onChange}
    />
  );
};
const BackgroundImage = () => {
  const type = "background-image";
  const variable = getSetting(useAppSelector, type);
  const toggled = !!variable;
  const dispatch = useAppDispatch();

  const setToInitial = () => {
    dispatch(
      changeElementStyle({
        types: [type],
        newValue: `url("${CONFIG.placeholderImgUrl}")`,
      })
    );
    dispatch(
      changeElementStyle({
        types: ["background-repeat"],
        newValue: "no-repeat",
      })
    );
    dispatch(
      changeElementStyle({
        types: ["background-position"],
        newValue: "50% 50%",
      })
    );
    dispatch(
      changeElementStyle({
        types: ["background-size"],
        newValue: "cover",
      })
    );
  };
  const handleToggle = () => {
    if (!toggled) {
      setToInitial();
    } else {
      dispatch(
        changeElementStyle({
          types: [type],
          newValue: "",
        })
      );
      dispatch(
        changeElementStyle({ types: ["background-position"], newValue: "" })
      );
      dispatch(
        changeElementStyle({ types: ["background-repeat"], newValue: "" })
      );
      dispatch(
        changeElementStyle({ types: ["background-size"], newValue: "" })
      );
    }
  };

  return (
    <WrapperWithBottomLine>
      <SecondaryTitle title="Background Image">
        <ToggleBtn checked={toggled} onChange={handleToggle} />
      </SecondaryTitle>
      {toggled && (
        <>
          <Link />
          <BackgroundPositionPicker />
          <BackgroundSize />
          <ResetButton onClick={() => setToInitial()} />
        </>
      )}
    </WrapperWithBottomLine>
  );
};

const Link = () => {
  const type = "background-image";
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();
  return (
    <UploadWrapper
      onEditOrAdd={(newValue) => {
        dispatch(
          changeElementStyle({
            types: [type],
            newValue: `url(${newValue})`,
          })
        );
      }}
    >
      <LinkInput
        title="Source url"
        value={extractUrlValue(variable || "")}
        onChange={(e) =>
          dispatch(
            changeElementStyle({
              types: [type],
              newValue: `url(${e.target.value})`,
            })
          )
        }
      />
    </UploadWrapper>
  );
};

const BackgroundSize = () => {
  const type = "background-size";
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();
  return (
    <Select
      title="Background Size"
      options={["cover", "contain"]}
      selected={variable || ""}
      onChange={(e) =>
        dispatch(
          changeElementStyle({
            types: ["background-size"],
            newValue: e.target.value,
          })
        )
      }
    />
  );
};
export default Background;
