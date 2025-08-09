import {
  selectActiveType,
  selectVariables,
  useAppDispatch,
  useAppSelector,
} from "@/redux/hooks";
import { changeElementStyle } from "@/redux/slices/editorSlice";
import {
  capitalizeFirstLetter,
  convertVarIdToVarName,
  findInVariables,
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
import ResetButton from "../ResetButton";
import VariableSelector from "../VariableSelector";
import WrapperWithBottomLine from "../WrapperWithBottomLine";

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
  const activeType = useAppSelector(selectActiveType);
  const variable = getSetting(useAppSelector, type);

  return (
    <WrapperWithBottomLine>
      <ShorthandTogglerPicker
        type={type}
        variable={variable}
        onChange={(newValue) =>
          dispatch(
            changeElementStyle({
              types: [type],
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
              types: [type],
              newValue:
                (getDefaultStyle(activeType)[type] as string) ||
                "0px 0px 0px 0px ",
            })
          );
        }}
      />
    </WrapperWithBottomLine>
  );
};

export const ShorthandTogglerPicker = ({
  type,
  variable,
  onChange,
  variablesAvailable = true,
}: {
  type: string;
  variable: StringOrUnd;
  onChange: (newVal: string) => void;
  variablesAvailable?: boolean;
}) => {
  const variables = useAppSelector(selectVariables);
  const [toggle, setToggle] = useState(false);
  const corner = type === "border-radius";
  const value = convertVarIdToVarName(variable || "", useAppSelector);
  const variableType = corner ? type : "margin/padding";

  const handleInputChange = (e: string, i: number | undefined) => {
    const newVar =
      findInVariables(variable || "", variables)?.value || variable;

    const dispatchFunc = (newValue: string) => {
      onChange(newValue);
    };
    if (i !== undefined) {
      dispatchFunc(setValueFromShorthandStr(newVar, i, e));
    } else {
      let updatedVariable = variable || "";

      sizingTypeArray?.forEach((item, i) => {
        updatedVariable = setValueFromShorthandStr(newVar, i, e);
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
              value={
                variable?.startsWith("var")
                  ? value || ""
                  : getValueFromShorthandStr(value, i)
              }
              title={item.title}
              onChange={(e) => handleInputChange(e, i)}
            />
          ))}
        </>
      )}
      {!toggle && (
        <Slider
          units={units}
          value={
            variable?.startsWith("var")
              ? value || ""
              : getValueFromShorthandStr(value, 0) || ""
          }
          title={corner ? "All corners" : "All sides"}
          onChange={(e) => handleInputChange(e, undefined)}
        />
      )}
      {variablesAvailable && (
        <VariableSelector
          selected={variable || ""}
          type={variableType}
          onChange={(value) => onChange(value)}
        />
      )}
    </>
  );
};

export default ShorthandToggler;
