import { ChangeEvent } from "react";

const GroupedRadioButtons = ({
  valuesArr,
  name,
  checked,
  onChange,
}: {
  valuesArr: string[];
  checked: string;
  name: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <form className="mt-1 flex items-center">
      {valuesArr.map((item) => (
        <span key={item} className="flex items-center">
          <input
            id={"radio-" + item + name}
            type="radio"
            name={name}
            value={item}
            checked={checked === item}
            onChange={onChange}
            className="w-4 h-4 rounded-sm"
          />
          <label
            htmlFor={"radio-" + item + name}
            className="mx-1 me-3 text-sm font-medium"
          >
            {item}
          </label>
        </span>
      ))}
    </form>
  );
};

export default GroupedRadioButtons;
