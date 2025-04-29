import {
  CONFIG,
  extractUrlValue,
  getSetting,
  getValueFromShorthandStr,
  setValueFromShorthandStr,
} from "@/utils/Helpers";
import ToggleVisibilityWrapper from "../../ToggleVisibilityWrapper";
import { selectPageWise, useAppDispatch, useAppSelector } from "@/redux/hooks";
import ColorPicker, {
  hexToHexWithAlpha,
  separateHexAlpha,
} from "../../ColorPicker";
import {
  changeElementStyle,
  removeElementStyle,
} from "@/redux/slices/editorSlice";
import BottomLine from "../../BottomLine";
import { AppChangeEvent, HandleChangeType } from "@/utils/Types";
import SecondaryTitle from "../../SecondaryTitle";
import ToggleBtn from "../../ToggleBtn";
import LinkInput from "../../LinkInput";
import Select from "../../Select";
import ResetButton from "../../ResetButton";
import Slider from "../../Slider";
import { BackgroundPositionPicker } from "./BackgroundPositionPicker";

const Background = () => {
  return (
    <ToggleVisibilityWrapper title="Background">
      <BackgroundColor />
      <BackgroundImage />
      <BackgroundShadow />
    </ToggleVisibilityWrapper>
  );
};

const BackgroundColor = () => {
  const type = "background-color";
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();
  const pageWise = useAppSelector(selectPageWise);

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
        title="Select background color"
        selected={variable || pageWise[type] || "#ffffff"}
        onChange={(newValue) =>
          dispatch(
            changeElementStyle({
              type,
              newValue,
            })
          )
        }
      />
      <ResetButton onClick={() => dispatch(removeElementStyle({ type }))} />
      <BottomLine />
    </div>
  );
};
const BackgroundShadow = () => {
  const type = "box-shadow";
  const variable = getSetting(useAppSelector, type);
  const pageWise = useAppSelector(selectPageWise);
  const toggled = !!variable;
  const dispatch = useAppDispatch();
  const handleToggle = () => {
    if (!toggled) {
      dispatch(
        changeElementStyle({
          type,
          newValue: "5px 5px 5px 2px " + pageWise.color || "#000000",
        })
      );
    } else {
      dispatch(removeElementStyle({ type }));
    }
  };
  const handleChange = (e: string, i: number) => {
    dispatch(
      changeElementStyle({
        type,
        newValue: setValueFromShorthandStr(variable, i, e),
      })
    );
  };
  return (
    <div className="relative pb-2 mb-2">
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
        </>
      )}

      <BottomLine />
    </div>
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
      max={50}
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
  const handleToggle = () => {
    if (!toggled) {
      dispatch(
        changeElementStyle({
          type,
          newValue: `url("${CONFIG.placeholderImgUrl}")`,
        })
      );
      dispatch(
        changeElementStyle({
          type: "background-repeat",
          newValue: "no-repeat",
        })
      );
      dispatch(
        changeElementStyle({
          type: "background-position",
          newValue: "50% 50%",
        })
      );
      dispatch(
        changeElementStyle({
          type: "background-size",
          newValue: "cover",
        })
      );
    } else {
      dispatch(removeElementStyle({ type }));
      dispatch(removeElementStyle({ type: "background-position" }));
      dispatch(removeElementStyle({ type: "background-repeat" }));
      dispatch(removeElementStyle({ type: "background-size" }));
    }
  };

  return (
    <div className="relative pb-2 mb-2">
      <SecondaryTitle title="Background Image">
        <ToggleBtn checked={toggled} onChange={handleToggle} />
      </SecondaryTitle>
      {toggled && (
        <>
          <Link />
          <BackgroundPositionPicker />
          <BackgroundSize />
        </>
      )}

      <BottomLine />
    </div>
  );
};

const Link = () => {
  const type = "background-image";
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();
  return (
    <LinkInput
      title="Source url"
      value={extractUrlValue(variable || "")}
      onChange={(e) =>
        dispatch(
          changeElementStyle({
            type,
            newValue: `url(${e.target.value})`,
          })
        )
      }
    />
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
      selected={variable || "auto"}
      onChange={(e) =>
        dispatch(
          changeElementStyle({
            type: "background-size",
            newValue: e.target.value,
          })
        )
      }
    />
  );
};
export default Background;
