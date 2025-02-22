import { ChangeEvent } from "react";

const NumberInput = ({
  title,
  value,
  onChange,
}: {
  title: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  const parsed = parseInt(value, 10) || "";

  return (
    <form className="mb-2">
      <label
        htmlFor={"number-input-" + title}
        className="block mb-2 text-sm font-medium text-text"
      >
        {title}
      </label>
      <input
        type="number"
        id={"number-input-" + title}
        value={parsed}
        onChange={onChange}
        className="bg-gray-700 border border-gray-600 text-dark text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
      />
    </form>
  );
};

export default NumberInput;
