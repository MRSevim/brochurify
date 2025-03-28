import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import Icon from "../Icon";
import Slider from "../Slider";
import { SizingType } from "@/utils/Types";
import {
  capitalizeFirstLetter,
  CONFIG,
  getSetting,
  getUnit,
  getValueFromShorthandStr,
  setValueFromShorthandStr,
} from "@/utils/Helpers";
import Border from "./Border";
import { selectActive, useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  changeElementStyle,
  changeInnerElementStyle,
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
  const isIcon = useAppSelector(selectActive)?.type === "icon";

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
  const activeId = useAppSelector(selectActive)?.id;
  const [outerType, setOuterType] = useState("base");

  return (
    <div className="relative pb-2 mb-2">
      <SecondaryTitle title="Width and Height" />
      <SmallText>
        Pixel, percentage based or automatic size settings for the element
      </SmallText>
      <TypeSelect type={outerType} setType={setOuterType} />
      <div className="flex gap-2" key={outerType + activeId}>
        <NumberController type="width" outerType={outerType} />
        <NumberController type="height" outerType={outerType} />
      </div>
      <SmallText>
        Base styles will apply to every screen size if mobile or tablet is not
        set
      </SmallText>
      <BottomLine />
    </div>
  );
};
const typeArr = [
  { text: "Base", type: "base" },
  { text: "Tablet", type: CONFIG.possibleOuterTypes.tabletContainerQuery },
  { text: "Mobile", type: CONFIG.possibleOuterTypes.mobileContainerQuery },
];
const TypeSelect = ({
  setType,
  type,
}: {
  setType: Dispatch<SetStateAction<string>>;
  type: string;
}) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-2">
      {typeArr.map((item) => (
        <TypeItem
          key={item.text}
          globalType={type}
          type={item.type}
          text={item.text}
          onClick={() => {
            setType(item.type);
          }}
        />
      ))}
    </div>
  );
};
const TypeItem = ({
  text,
  onClick,
  type,
  globalType,
}: {
  text: string;
  onClick: () => void;
  type: string;
  globalType: string;
}) => {
  return (
    <div
      className={
        "text-background  p-2 cursor-pointer " +
        (type === globalType ? " bg-gray" : "bg-text")
      }
      onClick={onClick}
    >
      {text}
    </div>
  );
};

const possibleRadioValues = ["px", "%", "auto"];

const NumberController = ({
  type,
  outerType,
}: {
  type: string;
  outerType: string;
}) => {
  const selectorOuterType = outerType === "base" ? type : outerType;
  const selectorInnerType = outerType === "base" ? undefined : type;
  const dispatch = useAppDispatch();
  const variable = getSetting(
    useAppSelector,
    selectorOuterType,
    selectorInnerType
  );
  const initialType = getUnit(variable);
  const [radioType, setRadioType] = useState(initialType || "px");

  const dispatchChange = (newValue: string): void => {
    if (selectorInnerType) {
      dispatch(
        changeInnerElementStyle({
          outerType: selectorOuterType,
          innerType: selectorInnerType,
          newValue,
        })
      );
    } else {
      dispatch(
        changeElementStyle({
          type: selectorOuterType,
          newValue,
        })
      );
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      if (outerType === "base") {
        dispatch(removeElementStyle({ type }));
      } else {
        dispatchChange("");
      }
    } else {
      const newValue = +e.target.value + radioType;

      dispatchChange(newValue);
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
            dispatchChange("auto");
          } else if (variable) {
            dispatchChange(parseInt(variable, 10) + e.target.value);

            if (variable === "auto") {
              if (selectorInnerType) {
                dispatch(
                  changeInnerElementStyle({
                    outerType: selectorOuterType,
                    innerType: selectorInnerType,
                    newValue: "",
                  })
                );
              } else {
                dispatch(removeElementStyle({ type: selectorOuterType }));
              }
            }
          }
          setRadioType(e.target.value);
        }}
      />

      <NumberInput
        disabled={radioType === "auto"}
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
  const type = "font-size";
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
