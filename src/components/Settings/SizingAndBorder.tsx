import { ChangeEvent, useState } from "react";
import Icon from "../Icon";
import ShorthandSettingWrapper from "../ShorthandSettingWrapper";
import Slider from "../Slider";
import { SizingType } from "@/utils/Types";
import {
  capitalizeFirstLetter,
  getSetting,
  setValueFromShorthandStr,
} from "@/utils/Helpers";
import Border from "./Border";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { changeElementStyle } from "@/redux/slices/editorSlice";

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

const SizingAndBorder = () => {
  return (
    <>
      <h1 className="font-medium text-lg text-light ">Sizing and Border</h1>
      <MarginOrPadding sizingTypeArray={sizingTypeArray} type="margin" />
      <Border />
      <MarginOrPadding sizingTypeArray={sizingTypeArray} type="padding" />
    </>
  );
};

const MarginOrPadding = ({
  sizingTypeArray,
  type,
}: {
  sizingTypeArray: SizingType[];
  type: string;
}) => {
  const [toggle, setToggle] = useState(false);
  const dispatch = useAppDispatch();
  const variable = getSetting(useAppSelector, type);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    i: number | undefined
  ) => {
    const dispatchFunc = (type: string, newValue: string) => {
      dispatch(
        changeElementStyle({
          type,
          newValue,
        })
      );
    };
    if (i !== undefined) {
      dispatchFunc(
        type,
        setValueFromShorthandStr(variable, i, e.target.value + "px")
      );
    } else {
      let updatedVariable = variable || "";

      sizingTypeArray?.forEach((item, i) => {
        updatedVariable = setValueFromShorthandStr(
          updatedVariable,
          i,
          e.target.value + "px"
        );
      });
      dispatchFunc(type, updatedVariable);
    }
  };

  return (
    <section className="relative pb-2 mb-2">
      <section className="flex justify-between items-center mb-1">
        <h1 className="font-medium text-light ">
          {capitalizeFirstLetter(type)}
        </h1>
        <span onClick={() => setToggle((prev) => !prev)}>
          <Icon
            type={toggle ? "arrows-angle-contract" : "arrows-angle-expand "}
            size="20px"
          />
        </span>
      </section>
      {toggle && (
        <>
          {sizingTypeArray.map((item, i) => (
            <ShorthandSettingWrapper type={type} key={i} i={i}>
              <Slider
                min={0}
                max={50}
                step={2}
                title={item.title}
                onChange={(e) => handleInputChange(e, i)}
              />
            </ShorthandSettingWrapper>
          ))}
        </>
      )}
      {!toggle && (
        <ShorthandSettingWrapper type={type}>
          <Slider
            min={0}
            max={50}
            step={2}
            title={"All sides"}
            onChange={(e) => handleInputChange(e, undefined)}
          />
        </ShorthandSettingWrapper>
      )}
      <div className="absolute left-0 bottom-0 w-full h-[2px] bg-light rounded"></div>
    </section>
  );
};
export default SizingAndBorder;
