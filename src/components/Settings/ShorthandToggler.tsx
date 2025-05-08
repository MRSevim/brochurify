import { selectActive, useAppDispatch, useAppSelector } from "@/redux/hooks";
import { changeElementStyle } from "@/redux/slices/editorSlice";
import {
  capitalizeFirstLetter,
  getDefaultStyle,
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
import ResetButton from "../ResetButton";

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
  const activeType = useAppSelector(selectActive)?.type;
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

export default ShorthandToggler;
