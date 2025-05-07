import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { changeElementStyle } from "@/redux/slices/editorSlice";
import {
  capitalizeFirstLetter,
  getSetting,
  getValueFromShorthandStr,
  setValueFromShorthandStr,
} from "@/utils/Helpers";
import { SizingType } from "@/utils/Types";
import { useState } from "react";
import SecondaryTitle from "../SecondaryTitle";
import Icon from "../Icon";
import Slider from "../Slider";
import BottomLine from "../BottomLine";

const units = ["px", "em", "%"];

const ShorthandToggler = ({
  sizingTypeArray,
  type,
  corner = false,
}: {
  sizingTypeArray: SizingType[];
  type: string;
  corner?: boolean;
}) => {
  const [toggle, setToggle] = useState(false);
  const dispatch = useAppDispatch();
  const variable = getSetting(useAppSelector, type);

  const handleInputChange = (e: string, i: number | undefined) => {
    const dispatchFunc = (type: string, newValue: string) => {
      dispatch(
        changeElementStyle({
          type,
          newValue,
        })
      );
    };
    if (i !== undefined) {
      dispatchFunc(type, setValueFromShorthandStr(variable, i, e));
    } else {
      let updatedVariable = variable || "";

      sizingTypeArray?.forEach((item, i) => {
        updatedVariable = setValueFromShorthandStr(updatedVariable, i, e);
      });
      dispatchFunc(type, updatedVariable);
    }
  };

  return (
    <div className="relative pb-2 mb-2">
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
      <BottomLine />
    </div>
  );
};

export default ShorthandToggler;
