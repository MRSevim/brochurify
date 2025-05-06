import { ChangeEvent } from "react";

const NumberInput = ({
  disabled,
  title,
  value,
  onChange,
}: {
  title: string;
  value: string;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  const parsed = isNaN(parseInt(value, 10)) ? "" : parseInt(value, 10);

  return (
    <form className="mb-2">
      <label
        htmlFor={"number-input-" + title}
        className="block mb-2 text-sm font-medium text-text"
      >
        {title}
      </label>
      <input
        disabled={disabled}
        type="number"
        id={"number-input-" + title}
        value={parsed}
        onChange={onChange}
        className="text-sm rounded-lg block w-full p-2.5"
      />
    </form>
  );
};

export default NumberInput;
