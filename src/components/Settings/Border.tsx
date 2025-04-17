import ToggleBtn from "../ToggleBtn";
import Slider from "../Slider";
import {
  getSetting,
  getValueFromShorthandStr,
  setValueFromShorthandStr,
} from "@/utils/Helpers";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  changeElementStyle,
  removeElementStyle,
} from "@/redux/slices/editorSlice";
import Select from "../Select";
import ColorPicker from "../ColorPicker";
import BottomLine from "../BottomLine";
import SecondaryTitle from "../SecondaryTitle";
import { AppChangeEvent, HandleChangeType } from "@/utils/Types";

const Border = () => {
  const type = "border";
  const borderRadiusType = "border-radius";
  const borderStr = getSetting(useAppSelector, type);
  const borderRadiusValue = getSetting(useAppSelector, borderRadiusType);
  const toggled = !!borderStr;
  const dispatch = useAppDispatch();

  const handleToggle = () => {
    if (!toggled) {
      dispatch(
        changeElementStyle({
          type,
          newValue: "2px solid #000000",
        })
      );
      dispatch(
        changeElementStyle({
          type: borderRadiusType,
          newValue: "0%",
        })
      );
    } else {
      dispatch(removeElementStyle({ type }));
      dispatch(removeElementStyle({ type: borderRadiusType }));
    }
  };

  const handleChange = (e: AppChangeEvent | string, i: number) => {
    const px = i === 0 ? "px" : "";
    const value = i !== 2 && typeof e !== "string" ? e.target.value : e;
    dispatch(
      changeElementStyle({
        type,
        newValue: setValueFromShorthandStr(borderStr, i, value + px),
      })
    );
  };
  return (
    <div className="relative pb-2 mb-2">
      <SecondaryTitle title="Border">
        <ToggleBtn checked={toggled} onChange={handleToggle} />
      </SecondaryTitle>
      {toggled && (
        <>
          <Slider
            parse={true}
            value={getValueFromShorthandStr(borderStr, 0)}
            min={0}
            max={50}
            step={2}
            title={"Thickness"}
            onChange={(e) => handleChange(e, 0)}
          />
          <BorderType
            onChange={(e) => handleChange(e, 1)}
            value={getValueFromShorthandStr(borderStr, 1)}
          />
          <BorderColor
            handleVarSelect={(param) => {
              dispatch(
                changeElementStyle({
                  type,
                  newValue: setValueFromShorthandStr(borderStr, 2, param),
                })
              );
            }}
            onChange={(e) => handleChange(e, 2)}
            value={getValueFromShorthandStr(borderStr, 2)}
          />
          <Slider
            parse={true}
            value={borderRadiusValue || "0"}
            min={0}
            max={50}
            step={1}
            title={"Border Radius (%)"}
            onChange={(e) =>
              dispatch(
                changeElementStyle({
                  type: borderRadiusType,
                  newValue: e.target.value + "%",
                })
              )
            }
          />
        </>
      )}

      <BottomLine />
    </div>
  );
};

const BorderColor = ({
  onChange,
  handleVarSelect,
  value,
}: {
  onChange: (e: string) => void;
  handleVarSelect: (param: string) => void;
  value: string;
}) => {
  return (
    <ColorPicker
      onVarSelect={handleVarSelect}
      title={"Select a border color"}
      selected={value}
      onChange={onChange}
    />
  );
};

const BorderType = ({
  onChange,
  value,
}: {
  onChange: HandleChangeType;
  value: string;
}) => {
  const types = [
    "dotted",
    "dashed",
    "solid",
    "double",
    "groove",
    "ridge",
    "inset",
    "outset",
  ];

  return (
    <Select
      title={"Select a border type"}
      options={types}
      selected={value}
      onChange={onChange}
    />
  );
};

export default Border;
