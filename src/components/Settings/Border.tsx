import { ChangeEvent, useState } from "react";
import ToggleBtn from "../ToggleBtn";
import ShorthandSettingWrapper, {
  useSetting,
} from "../ShorthandSettingWrapper";
import Slider from "../Slider";
import { getSetting, setValueFromShorthandStr } from "@/utils/Helpers";
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
  const borderStr = getSetting(useAppSelector, type);
  const toggled = !!borderStr;
  const dispatch = useAppDispatch();

  const handleToggle = () => {
    if (!toggled) {
      dispatch(
        changeElementStyle({
          type,
          newValue: "2px solid black",
        })
      );
    } else {
      dispatch(removeElementStyle({ type }));
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
          <ShorthandSettingWrapper type={type} i={0}>
            <Slider
              min={0}
              max={50}
              step={2}
              title={"Thickness"}
              onChange={(e) => handleChange(e, 0)}
            />
          </ShorthandSettingWrapper>
          <ShorthandSettingWrapper type={type} i={1}>
            <BorderType onChange={(e) => handleChange(e, 1)} />
          </ShorthandSettingWrapper>
          <ShorthandSettingWrapper type={type} i={2}>
            <BorderColor onChange={(e) => handleChange(e, 2)} />
          </ShorthandSettingWrapper>
        </>
      )}

      <BottomLine />
    </div>
  );
};

const BorderColor = ({ onChange }: { onChange: HandleChangeType }) => {
  const { value } = useSetting();

  return (
    <ColorPicker
      title={"Select a border color:"}
      selected={value}
      onChange={onChange}
    />
  );
};

const BorderType = ({ onChange }: { onChange: HandleChangeType }) => {
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
  const { value } = useSetting();
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
