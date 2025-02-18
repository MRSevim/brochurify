import { ChangeEvent, useEffect, useState } from "react";
import Icon from "../Icon";
import Slider from "../Slider";
import { SizingType } from "@/utils/Types";
import {
  capitalizeFirstLetter,
  getSetting,
  getValueFromShorthandStr,
  setValueFromShorthandStr,
} from "@/utils/Helpers";
import Border from "./Border";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  changeElementStyle,
  removeElementStyle,
} from "@/redux/slices/editorSlice";
import Image from "next/image";
import marginBorderPadding from "../../../public/margin-border-padding.webp";
import ToggleVisibilityWrapper from "../ToggleVisibilityWrapper";
import NumberInput from "../NumberInput";
import SecondaryTitle from "../SecondaryTitle";
import BottomLine from "../BottomLine";
import GroupedRadioButtons from "../GroupedRadioButtons";
import SmallText from "../SmallText";

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
  const isIcon = active?.type === "icon";
  return (
    <>
      {" "}
      <Image
        src={marginBorderPadding}
        alt="Margin, border, padding schema"
        className="mb-2 w-full h-auto"
      />
      <MarginOrPadding sizingTypeArray={sizingTypeArray} type="margin" />
      <Border />
      <MarginOrPadding sizingTypeArray={sizingTypeArray} type="padding" />
      <WidthAndHeight />
      {isIcon && <Size />}
    </>
  );
};

export const WidthAndHeight = () => {
  const activeId = useAppSelector((state) => state.editor.active?.id);
  return (
    <div className="relative pb-2 mb-2">
      <SecondaryTitle title="Width and Height" />
      <SmallText>
        Pixel, percentage based or automatic size settings for the element
      </SmallText>
      <div className="flex gap-2" key={activeId}>
        <NumberController type="width" />
        <NumberController type="height" />
      </div>
      <BottomLine />
    </div>
  );
};

const possibleRadioValues = ["px", "%", "auto"];
const getUnit = (value: string | undefined) => {
  if (!value) return;
  const match = value.match(/\d+(px|%)|auto/);
  return match ? match[0].replace(/\d+/, "") : null;
};

const NumberController = ({ type }: { type: string }) => {
  const dispatch = useAppDispatch();
  const variable = getSetting(useAppSelector, type);
  const initialType = getUnit(variable);
  const [radioType, setRadioType] = useState(initialType || "px");

  useEffect(() => {
    if (variable && variable !== "auto" && radioType !== "auto") {
      dispatch(
        changeElementStyle({
          type,
          newValue: parseInt(variable, 10) + radioType,
        })
      );
    } else if (variable === "auto" && radioType !== "auto") {
      dispatch(removeElementStyle({ type }));
    }
  }, [radioType]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      dispatch(removeElementStyle({ type }));
    } else {
      dispatch(
        changeElementStyle({ type, newValue: +e.target.value + radioType })
      );
    }
  };

  return (
    <div className="mb-2 flex flex-col items-center">
      <GroupedRadioButtons
        valuesArr={possibleRadioValues}
        checked={radioType}
        name={type}
        onChange={(e) => {
          if (e.target.value === "auto") {
            dispatch(changeElementStyle({ type, newValue: "auto" }));
          }
          setRadioType(e.target.value);
        }}
      />

      <NumberInput
        title={type}
        value={variable || ""}
        onChange={handleInputChange}
      ></NumberInput>
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

const Size = () => {
  const type = "fontSize";
  const dispatch = useAppDispatch();
  const variable = getSetting(useAppSelector, type);
  return (
    <Slider
      parse={true}
      value={variable || "25px"}
      min={5}
      max={80}
      step={2}
      title="Size"
      onChange={(e) =>
        dispatch(
          changeElementStyle({
            type,
            newValue: e.target.value + "px",
          })
        )
      }
    />
  );
};
export default SizingAndBorder;
