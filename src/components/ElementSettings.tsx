import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { changeElementStyle } from "@/redux/slices/editorSlice";
import Setting from "./Setting";
import Slider from "./Slider";

const ElementSettings = () => {
  return (
    <>
      <Sizing />
    </>
  );
};

export default ElementSettings;

const Sizing = () => {
  return (
    <Setting type="padding">
      <Slider min={0} max={50} step={2} />
    </Setting>
  );
};
