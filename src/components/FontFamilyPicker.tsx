import { selectPageWise, useAppSelector } from "@/redux/hooks";
import { defaultInheritFontOptions, getFontVariables } from "@/utils/Helpers";
import Select from "@/components/Select";

const FontFamilyPicker = ({
  variable,
  onChange,
}: {
  variable: string;
  onChange: (newVal: string) => void;
}) => {
  const pageWise = useAppSelector(selectPageWise);
  const fontVariables = getFontVariables(useAppSelector);
  const finalSelected =
    pageWise["font-family"] === "initial"
      ? "inherit"
      : pageWise["font-family"] || "inherit";
  return (
    <Select
      title="Select font family"
      showStyled={true}
      options={[...fontVariables, ...defaultInheritFontOptions]}
      selected={variable || finalSelected}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default FontFamilyPicker;
