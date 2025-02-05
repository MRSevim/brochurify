import { ChangeEvent, useState } from "react";
import Icon from "../Icon";
import Slider from "../Slider";
import { SizingType } from "@/utils/Types";
import {
  capitalizeFirstLetter,
  getProp,
  getSetting,
  getValueFromShorthandStr,
  setValueFromShorthandStr,
} from "@/utils/Helpers";
import Border from "./Border";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  changeElementProp,
  changeElementStyle,
} from "@/redux/slices/editorSlice";
import Image from "next/image";
import marginBorderPadding from "../../../public/margin-border-padding.webp";
import ToggleVisibilityWrapper from "../ToggleVisibilityWrapper";
import NumberInput from "../NumberInput";
import SecondaryTitle from "../SecondaryTitle";
import BottomLine from "../BottomLine";

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
    <ToggleVisibilityWrapper title="Sizing and Border">
      <SizingAndBorderInner />
    </ToggleVisibilityWrapper>
  );
};

const SizingAndBorderInner = () => {
  const active = useAppSelector((state) => state.editor.active);
  const shouldHaveWidthAndHeight =
    active && (active.type === "image" || active.type === "video");
  return (
    <>
      {" "}
      <Image
        src={marginBorderPadding}
        alt="Margin, border, padding schema"
        className="mb-2"
      />
      <MarginOrPadding sizingTypeArray={sizingTypeArray} type="margin" />
      <Border />
      <MarginOrPadding sizingTypeArray={sizingTypeArray} type="padding" />
      {shouldHaveWidthAndHeight && <WidthAndHeight />}
    </>
  );
};

const WidthAndHeight = () => {
  return (
    <div className="relative pb-2 mb-2">
      <SecondaryTitle title="Width and Height" />

      <div className="flex gap-2">
        <NumberController type="width" />
        <NumberController type="height" />
      </div>
      <BottomLine />
    </div>
  );
};

const NumberController = ({ type }: { type: string }) => {
  const dispatch = useAppDispatch();
  const value = getProp<number>(useAppSelector, type);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(changeElementProp({ type, newValue: +e.target.value }));
  };
  return (
    <div className="mb-2 flex items-center">
      <NumberInput
        title={type + ":"}
        value={+value}
        onChange={handleInputChange}
      />
    </div>
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
    <div className="relative pb-2 mb-2">
      <SecondaryTitle title={capitalizeFirstLetter(type)}>
        <Icon
          type={toggle ? "arrows-angle-contract" : "arrows-angle-expand "}
          size="20px"
          onClick={() => setToggle((prev) => !prev)}
          title="Expand/Contract"
        />
      </SecondaryTitle>

      {toggle && (
        <>
          {sizingTypeArray.map((item, i) => (
            <Slider
              parse={true}
              key={i}
              value={getValueFromShorthandStr(variable, i)}
              min={0}
              max={50}
              step={2}
              title={item.title}
              onChange={(e) => handleInputChange(e, i)}
            />
          ))}
        </>
      )}
      {!toggle && (
        <Slider
          parse={true}
          value={getValueFromShorthandStr(variable, 0)}
          min={0}
          max={50}
          step={2}
          title={"All sides"}
          onChange={(e) => handleInputChange(e, undefined)}
        />
      )}
      <BottomLine />
    </div>
  );
};
export default SizingAndBorder;
