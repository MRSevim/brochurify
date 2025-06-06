import Select from "@/components/Select";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { changeElementStyle } from "@/redux/slices/editorSlice";
import {
  defaultInheritFontOptions,
  getFontVariables,
  getPageWise,
  getSetting,
} from "@/utils/Helpers";
import InfoIcon from "@/components/InfoIcon";
import Slider from "@/components/Slider";
import ResetButton from "@/components/ResetButton";
import { Style, CONFIG } from "@/utils/Types";
import WrapperWithBottomLine from "@/components/WrapperWithBottomLine";

const HeadingStyles = () => {
  const outerType = CONFIG.headings;

  return (
    <WrapperWithBottomLine>
      <div className="flex justify-between mb-2">
        <h3 className="font-medium">Heading styles</h3>
        <InfoIcon text="Applies to all of the headings in your website" />
      </div>
      <FontFamily outerType={outerType} />
      <FontSize outerType="h1" />
      <FontSize outerType="h2" />
      <FontSize outerType="h3" />
    </WrapperWithBottomLine>
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
            changeElementStyle({
              types: [outerType, innerType],
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
            changeElementStyle({
              types: [outerType, innerType],
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
          changeElementStyle({
            types: [outerType, innerType],
            newValue:
              ((getPageWise()[outerType] as Style)[innerType] as string) || "",
          })
        );
      }}
    />
  );
};
export default HeadingStyles;
