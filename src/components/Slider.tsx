import { ChangeEvent } from "react";
import { useSetting } from "./ShorthandSettingWrapper";

type Props = {
  min: number;
  max: number;
  step: number;
  title: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};
const Slider = ({ min, max, step, title, onChange }: Props) => {
  const { value } = useSetting();
  const parsed = parseInt(value, 10);
  return (
    <div className="relative mb-8">
      <label
        htmlFor="steps-range"
        className=" mb-1 text-sm font-medium text-light "
      >
        {title}
      </label>
      <input
        id="steps-range"
        type="range"
        min={min}
        max={max}
        value={parsed}
        step={step}
        onChange={onChange}
        className="w-full h-2 bg-light rounded-lg appearance-none cursor-pointer"
      />
      <span className="text-sm text-gray-400 absolute start-0 -bottom-6">
        {min}px
      </span>
      <span className="text-sm text-gray-400 absolute start-0 end-0 mx-auto text-center -bottom-6">
        Current: {parsed}px
      </span>
      <span className="text-sm text-gray-400 absolute end-0 -bottom-6">
        {max}px
      </span>
    </div>
  );
};

export default Slider;
