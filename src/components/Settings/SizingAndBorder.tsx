import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { getSetting, getUnit } from "@/utils/Helpers";
import Border from "./Border";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { changeElementStyle } from "@/redux/slices/editorSlice";
import Image from "next/image";
import marginBorderPadding from "../../../public/margin-border-padding.webp";
import ToggleVisibilityWrapper from "../ToggleVisibilityWrapper";
import NumberInput from "../NumberInput";
import SecondaryTitle from "../SecondaryTitle";
import InfoIcon from "../InfoIcon";
import ShorthandToggler from "./ShorthandToggler";
import { CONFIG } from "@/utils/Types";
import VariableSelector from "../VariableSelector";
import WrapperWithBottomLine from "../WrapperWithBottomLine";
import UnitSelector from "../UnitSelector";

const SizingAndBorder = () => {
  return (
    <ToggleVisibilityWrapper title="Sizing and Border">
      <SizingAndBorderInner />
    </ToggleVisibilityWrapper>
  );
};

const SizingAndBorderInner = () => {
  return (
    <>
      {" "}
      <Image
        src={marginBorderPadding}
        alt="Margin, border, padding schema"
        className="mb-2 w-full h-auto"
      />
      <ShorthandToggler type="margin" />
      <Border />
      <ShorthandToggler type="padding" />
      <WidthAndHeight />
    </>
  );
};

export const WidthAndHeight = () => {
  const [outerType, setOuterType] = useState("base");

  return (
    <WrapperWithBottomLine>
      <SecondaryTitle title="Width and Height">
        <InfoIcon
          text="Pixel, percentage based or automatic size settings for the element. Note that base styles will apply to every screen size if mobile and tablet styles are not
        set"
        />
      </SecondaryTitle>

      <TypeSelect type={outerType} setType={setOuterType} />

      <ControllersWrapper outerType={outerType} prefix="" />
      <ControllersWrapper outerType={outerType} prefix="max-" />
      <ControllersWrapper outerType={outerType} prefix="min-" />
    </WrapperWithBottomLine>
  );
};

const ControllersWrapper = ({
  prefix,
  outerType,
}: {
  prefix: string;
  outerType: string;
}) => {
  return (
    <div className="flex gap-2 my-2">
      <NumberController type={prefix + "width"} outerType={outerType} />
      <NumberController type={prefix + "height"} outerType={outerType} />
    </div>
  );
};

const typeArr = [
  { text: "Base", type: "base" },
  { text: "Tablet", type: CONFIG.possibleOuterTypes.tabletContainerQuery },
  { text: "Mobile", type: CONFIG.possibleOuterTypes.mobileContainerQuery },
];
export const TypeSelect = ({
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

const possibleRadioValues = ["px", "%"];

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
    dispatch(
      changeElementStyle({
        types: [selectorOuterType, selectorInnerType],
        newValue,
      })
    );
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      dispatchChange("");
    } else {
      const newValue = +e.target.value + radioType;

      dispatchChange(newValue);
    }
  };

  const auto = type !== "max-height" && type !== "max-width" ? ["auto"] : [];

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center">
        <NumberInput
          disabled={radioType === "auto"}
          title={type}
          value={variable || ""}
          onChange={handleInputChange}
        ></NumberInput>
        <UnitSelector
          title=""
          units={[
            ...possibleRadioValues,
            type.includes("width") ? "vw" : "vh",
            ...auto,
          ]}
          value={radioType}
          onChange={(e) => {
            if (e.target.value === "auto") {
              dispatchChange("auto");
            } else if (variable) {
              dispatchChange(parseInt(variable, 10) + e.target.value);
            }
            setRadioType(e.target.value);
          }}
        />
      </div>

      <VariableSelector
        selected={variable}
        type="width/height"
        onChange={(value) => dispatchChange(value)}
      />
    </div>
  );
};

export default SizingAndBorder;
