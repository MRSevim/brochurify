import {
  CONFIG,
  extractUrlValue,
  getPageWise,
  getSetting,
  getValueFromShorthandStr,
  setValueFromShorthandStr,
} from "@/utils/Helpers";
import ToggleVisibilityWrapper from "../ToggleVisibilityWrapper";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import ColorPicker from "../ColorPicker";
import {
  changeElementStyle,
  removeElementStyle,
} from "@/redux/slices/editorSlice";
import BottomLine from "../BottomLine";
import { HandleChangeType } from "@/utils/Types";
import SecondaryTitle from "../SecondaryTitle";
import ToggleBtn from "../ToggleBtn";
import LinkInput from "../LinkInput";
import Select from "../Select";
import ResetButton from "../ResetButton";

const Background = () => {
  return (
    <ToggleVisibilityWrapper title="Background">
      <BackgroundColor />
      <BackgroundImage />
    </ToggleVisibilityWrapper>
  );
};

const BackgroundColor = () => {
  const type = "backgroundColor";
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
        title="Select background color"
        selected={variable || getPageWise()[type] || "#ffffff"}
        onChange={(e) =>
          dispatch(
            changeElementStyle({
              type,
              newValue: e.target.value,
            })
          )
        }
      />
      <ResetButton onClick={() => dispatch(removeElementStyle({ type }))} />
      <BottomLine />
    </div>
  );
};
const BackgroundImage = () => {
  const type = "backgroundImage";
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
          type: "backgroundRepeat",
          newValue: "no-repeat",
        })
      );
      dispatch(
        changeElementStyle({
          type: "backgroundPosition",
          newValue: "center center",
        })
      );
    } else {
      dispatch(removeElementStyle({ type }));
      dispatch(removeElementStyle({ type: "backgroundPosition" }));
      dispatch(removeElementStyle({ type: "backgroundRepeat" }));
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
          <Alignment />
        </>
      )}

      <BottomLine />
    </div>
  );
};

const Link = () => {
  const type = "backgroundImage";
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

const Alignment = () => {
  const type = "backgroundPosition";
  const positionStr = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();

  const handleChange: HandleChangeType = (e, i) => {
    dispatch(
      changeElementStyle({
        type,
        newValue: setValueFromShorthandStr(positionStr, i, e.target.value),
      })
    );
  };

  return (
    <>
      <VerticalOrHorizontal
        type="vertical"
        options={["right", "center", "left"]}
        onChange={(e) => handleChange(e, 0)}
        value={getValueFromShorthandStr(positionStr, 0)}
      />
      <VerticalOrHorizontal
        type="horizontal"
        options={["top", "center", "bottom"]}
        onChange={(e) => handleChange(e, 1)}
        value={getValueFromShorthandStr(positionStr, 1)}
      />
    </>
  );
};

const VerticalOrHorizontal = ({
  type,
  onChange,
  value,
  options,
}: {
  type: string;
  onChange: HandleChangeType;
  value: string;
  options: string[];
}) => {
  return (
    <Select
      title={"Select " + type + " alignment"}
      options={options}
      selected={value}
      onChange={onChange}
    />
  );
};
export default Background;
