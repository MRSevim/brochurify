import Select from "@/components/Select";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { changeInnerElementStyle } from "@/redux/slices/editorSlice";
import {
  CONFIG,
  defaultInheritFontOptions,
  getFontVariables,
  getPageWise,
  getSetting,
} from "@/utils/Helpers";
import BottomLine from "@/components/BottomLine";
import InfoIcon from "@/components/InfoIcon";
import Slider from "@/components/Slider";
import ResetButton from "@/components/ResetButton";
import { Style } from "@/utils/Types";

const HeadingStyles = () => {
  const outerType = CONFIG.headings;

  return (
    <div className="relative pb-2 mb-2">
      <div className="flex justify-between mb-2">
        <h3 className="font-medium">Heading styles</h3>
        <InfoIcon text="Applies to all of the headings in your website" />
      </div>
      <FontFamily outerType={outerType} />
      <FontSize outerType="h1" />
      <FontSize outerType="h2" />
      <FontSize outerType="h3" />
      <BottomLine />
    </div>
  );
};

const FontFamily = ({ outerType }: { outerType: string }) => {
  const innerType = "font-family";
  const dispatch = useAppDispatch();
  const variable = getSetting(useAppSelector, outerType, innerType);
  const fontVariables = getFontVariables(useAppSelector);

  return (
    <>
      <Select
        title="Select heading font family"
        showStyled={true}
        options={[...fontVariables, ...defaultInheritFontOptions]}
        selected={variable || ""}
        onChange={(e) => {
          dispatch(
            changeInnerElementStyle({
              outerType,
              innerType,
              newValue: e.target.value,
            })
          );
        }}
      />
      <ResetButtonWithOnClick outerType={outerType} innerType={innerType} />
    </>
  );
};

const FontSize = ({ outerType }: { outerType: string }) => {
  const innerType = "font-size";
  const dispatch = useAppDispatch();
  const variable = getSetting(useAppSelector, outerType, innerType);

  return (
    <>
      <Slider
        title={`Select ${outerType} font size`}
        step={0.5}
        units={["em", "px"]}
        value={variable || "1"}
        onChange={(newValue) =>
          dispatch(
            changeInnerElementStyle({
              outerType,
              innerType,
              newValue,
            })
          )
        }
      />
      <ResetButtonWithOnClick outerType={outerType} innerType={innerType} />
    </>
  );
};

export const ResetButtonWithOnClick = ({
  outerType,
  innerType,
}: {
  outerType: string;
  innerType: string;
}) => {
  const dispatch = useAppDispatch();
  return (
    <ResetButton
      onClick={() => {
        dispatch(
          changeInnerElementStyle({
            outerType,
            innerType,
            newValue:
              ((getPageWise()[outerType] as Style)[innerType] as string) || "",
          })
        );
      }}
    />
  );
};
export default HeadingStyles;
