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
import { SizingType } from "@/utils/Types";
import ShorthandToggler from "./ShorthandToggler";

const sizingTypeArray: SizingType[] = [
  {
    title: "Top Left",
  },
  {
    title: "Top Right",
  },
  {
    title: "Bottom Right",
  },
  {
    title: "Bottom Left",
  },
];

const Border = () => {
  const type = "border";
  const borderRadiusType = "border-radius";
  const borderStr = getSetting(useAppSelector, type);
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
          newValue: "0% 0% 0% 0%",
        })
      );
    } else {
      dispatch(removeElementStyle({ type }));
      dispatch(removeElementStyle({ type: borderRadiusType }));
    }
  };

  const handleChange = (e: string, i: number) => {
    dispatch(
      changeElementStyle({
        type,
        newValue: setValueFromShorthandStr(borderStr, i, e),
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
            units={["px", "em"]}
            value={getValueFromShorthandStr(borderStr, 0)}
            step={2}
            title={"Thickness"}
            onChange={(e) => handleChange(e, 0)}
          />
          <BorderType
            onChange={(e) => handleChange(e, 1)}
            value={getValueFromShorthandStr(borderStr, 1)}
          />
          <BorderColor
            onChange={(e) => handleChange(e, 2)}
            value={getValueFromShorthandStr(borderStr, 2)}
          />
          <ShorthandToggler
            sizingTypeArray={sizingTypeArray}
            type={borderRadiusType}
          />
        </>
      )}

      <BottomLine />
    </div>
  );
};

const BorderColor = ({
  onChange,
  value,
}: {
  onChange: (e: string) => void;
  value: string;
}) => {
  return (
    <ColorPicker
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
  onChange: (e: string) => void;
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
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default Border;
