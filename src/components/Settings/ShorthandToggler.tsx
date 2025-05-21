import { selectActive, useAppDispatch, useAppSelector } from "@/redux/hooks";
import { changeElementStyle } from "@/redux/slices/editorSlice";
import {
  capitalizeFirstLetter,
  getDefaultStyle,
  getSetting,
  getValueFromShorthandStr,
  setValueFromShorthandStr,
} from "@/utils/Helpers";
import { SizingType, StringOrUnd } from "@/utils/Types";
import { useState } from "react";
import SecondaryTitle from "../SecondaryTitle";
import Icon from "../Icon";
import Slider from "../Slider";
import BottomLine from "../BottomLine";
import ResetButton from "../ResetButton";

const units = ["px", "em", "%"];
const sizingTypeArray: SizingType[] = [
  {
    title: "Top",
  },
  {
    title: "Right",
  },
  {
    title: "Bottom",
  },
  {
    title: "Left",
  },
];

const ShorthandToggler = ({ type }: { type: string }) => {
  const dispatch = useAppDispatch();
  const activeType = useAppSelector(selectActive)?.type;
  const variable = getSetting(useAppSelector, type);

  return (
    <div className="relative pb-2 mb-2">
      <ShorthandTogglerPicker
        type={type}
        variable={variable}
        onChange={(newValue) =>
          dispatch(
            changeElementStyle({
              type,
              newValue,
            })
          )
        }
      />
      <ResetButton
        onClick={() => {
          if (!activeType) return;
          dispatch(
            changeElementStyle({
              type,
              newValue:
                (getDefaultStyle(activeType)[type] as string) ||
                "0px 0px 0px 0px ",
            })
          );
        }}
      />
      <BottomLine />
    </div>
  );
};

export const ShorthandTogglerPicker = ({
  type,
  variable,
  onChange,
}: {
  type: string;
  variable: StringOrUnd;
  onChange: (newVal: string) => void;
}) => {
  const [toggle, setToggle] = useState(false);
  const corner = type === "border-radius";

  const handleInputChange = (e: string, i: number | undefined) => {
    const dispatchFunc = (newValue: string) => {
      onChange(newValue);
    };
    if (i !== undefined) {
      dispatchFunc(setValueFromShorthandStr(variable, i, e));
    } else {
      let updatedVariable = variable || "";

      sizingTypeArray?.forEach((item, i) => {
        updatedVariable = setValueFromShorthandStr(updatedVariable, i, e);
      });
      dispatchFunc(updatedVariable);
    }
  };
  return (
    <>
      <SecondaryTitle title={capitalizeFirstLetter(type)}>
        <Icon
          type={toggle ? "arrows-angle-contract" : "arrows-angle-expand"}
          size="20px"
          onClick={() => setToggle((prev) => !prev)}
          title="Expand/Contract"
        />
      </SecondaryTitle>
      {toggle && (
        <>
          {sizingTypeArray.map((item, i) => (
            <Slider
              units={units}
              key={i}
              value={getValueFromShorthandStr(variable, i)}
              title={item.title}
              onChange={(e) => handleInputChange(e, i)}
            />
          ))}
        </>
      )}
      {!toggle && (
        <Slider
          units={units}
          value={getValueFromShorthandStr(variable, 0)}
          title={corner ? "All corners" : "All sides"}
          onChange={(e) => handleInputChange(e, undefined)}
        />
      )}
    </>
  );
};

export default ShorthandToggler;
