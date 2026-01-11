import ToggleBtn from "../../../../../components/ToggleBtn";
import Slider from "../../../../../components/Slider";
import {
  getSetting,
  getValueFromShorthandStr,
  setValueFromShorthandStr,
} from "@/utils/Helpers";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { changeElementStyle } from "@/features/builder/lib/redux/slices/editorSlice";
import Select from "../../../../../components/Select";
import ColorPicker from "../../../../../components/ColorPicker";
import SecondaryTitle from "../../../../../components/SecondaryTitle";
import ShorthandToggler from "./ShorthandToggler";
import ResetButton from "../../../../../components/ResetButton";
import WrapperWithBottomLine from "../../../../../components/WrapperWithBottomLine";

const Border = () => {
  const type = "border";
  const borderRadiusType = "border-radius";
  const borderStr = getSetting(useAppSelector, type);
  const toggled = !!borderStr;
  const dispatch = useAppDispatch();

  const setToInitial = () =>
    dispatch(
      changeElementStyle({
        types: [type],
        newValue: "2px solid #000000",
      })
    );

  const handleToggle = () => {
    if (!toggled) {
      setToInitial();
      dispatch(
        changeElementStyle({
          types: [borderRadiusType],
          newValue: "0% 0% 0% 0%",
        })
      );
    } else {
      dispatch(
        changeElementStyle({
          types: [type],
          newValue: "",
        })
      );
      dispatch(
        changeElementStyle({
          types: [borderRadiusType],
          newValue: "",
        })
      );
    }
  };

  const handleChange = (e: string, i: number) => {
    dispatch(
      changeElementStyle({
        types: [type],
        newValue: setValueFromShorthandStr(borderStr, i, e),
      })
    );
  };

  return (
    <WrapperWithBottomLine>
      <SecondaryTitle title="Border">
        <ToggleBtn checked={toggled} onChange={handleToggle} />
      </SecondaryTitle>
      {toggled && (
        <>
          <WrapperWithBottomLine>
            <Slider
              units={["px", "em"]}
              value={getValueFromShorthandStr(borderStr, 0)}
              step={2}
              title={"Thickness"}
              onChange={(e) => handleChange(e, 0)}
            />
            <BorderType
              onChange={(e) => handleChange(e, 1)}
              value={getValueFromShorthandStr(borderStr, 1)}
            />
            <BorderColor
              onChange={(e) => handleChange(e, 2)}
              value={getValueFromShorthandStr(borderStr, 2)}
            />
            <ResetButton onClick={() => setToInitial()} />
          </WrapperWithBottomLine>
          <ShorthandToggler type={borderRadiusType} />
        </>
      )}
    </WrapperWithBottomLine>
  );
};

const BorderColor = ({
  onChange,
  value,
}: {
  onChange: (e: string) => void;
  value: string;
}) => {
  return (
    <ColorPicker
      title={"Select a border color"}
      selected={value}
      onChange={onChange}
    />
  );
};

const BorderType = ({
  onChange,
  value,
}: {
  onChange: (e: string) => void;
  value: string;
}) => {
  const types = [
    "dotted",
    "dashed",
    "solid",
    "double",
    "groove",
    "ridge",
    "inset",
    "outset",
  ];

  return (
    <Select
      title={"Select a border type"}
      options={types}
      selected={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default Border;
