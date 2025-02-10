import { ChangeEvent, useState } from "react";
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

export type HandleChangeType = (
  e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  i?: number
) => void;

const Border = () => {
  const type = "border";
  const borderRadiusType = "borderRadius";
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

  const handleChange: HandleChangeType = (e, i) => {
    const px = i === 0 ? "px" : "";
    dispatch(
      changeElementStyle({
        type,
        newValue: setValueFromShorthandStr(borderStr, i, e.target.value + px),
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
  value,
}: {
  onChange: HandleChangeType;
  value: string;
}) => {
  return (
    <ColorPicker
      title={"Select a border color:"}
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
      title={"Select a border type:"}
      options={types}
      selected={value}
      onChange={onChange}
    />
  );
};

export default Border;
