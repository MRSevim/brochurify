import { ChangeEvent } from "react";

const NumberInput = ({
  title,
  value,
  onChange,
}: {
  title: string;
  value: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <form>
      <label
        htmlFor="number-input"
        className="block mb-2 text-sm font-medium text-text"
      >
        {title}
      </label>
      <input
        type="number"
        id="number-input"
        value={value}
        onChange={onChange}
        className="bg-gray-700 border border-gray-600 text-dark text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
      />
    </form>
  );
};

export default NumberInput;
