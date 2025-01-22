import { capitalizeFirstLetter } from "@/utils/Helpers";
import { useSetting } from "./Setting";

type Props = {
  min: number;
  max: number;
  step: number;
};
const Slider = ({ min, max, step }: Props) => {
  const { value, onChange, type } = useSetting();
  return (
    <section className="relative mb-6">
      <label
        htmlFor="steps-range"
        className=" mb-1 text-sm font-medium text-light "
      >
        {capitalizeFirstLetter(type)}
      </label>
      <input
        id="steps-range"
        type="range"
        min={min}
        max={max}
        value={parseInt(value, 10)}
        step={step}
        onChange={onChange}
        className="w-full h-2 bg-light rounded-lg appearance-none cursor-pointer"
      />
      <span className="text-sm text-gray-400 absolute start-0 -bottom-6">
        {min}px
      </span>

      <span className="text-sm text-gray-400 absolute end-0 -bottom-6">
        {min}px
      </span>
    </section>
  );
};

export default Slider;
