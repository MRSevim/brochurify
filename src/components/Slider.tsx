import { ChangeEvent } from "react";

type Props = {
  min: number;
  max: number;
  step: number;
  value: string;
  title: string;
  parse: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};
const Slider = ({ min, max, step, title, onChange, value, parse }: Props) => {
  const parsed = parse ? parseInt(value, 10) : value; //gets the first full number inside value if necessary

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
        {min}
      </span>
      <span className="text-sm text-gray-400 absolute start-0 end-0 mx-auto text-center -bottom-6">
        Current: {value}
      </span>
      <span className="text-sm text-gray-400 absolute end-0 -bottom-6">
        {max}
      </span>
    </div>
  );
};

export default Slider;
