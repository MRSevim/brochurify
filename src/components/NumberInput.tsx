import { ChangeEvent } from "react";

const NumberInput = ({
  disabled,
  title,
  children,
  value,
  onChange,
}: {
  title: string;
  value: string;
  disabled?: boolean;
  children?: React.ReactNode;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  const parsed = isNaN(parseFloat(value)) ? "" : parseFloat(value);

  return (
    <form className="mb-2 flex flex-col justify-between">
      <label
        htmlFor={"number-input-" + title}
        className="block mb-2 text-sm font-medium text-text"
      >
        {title}
      </label>
      <div className="flex gap-1 mx-2">
        <input
          disabled={disabled}
          step={0.1}
          type="number"
          id={"number-input-" + title}
          value={parsed}
          onChange={onChange}
          className="text-sm rounded-lg block w-full p-2.5"
        />
        {children && children}
      </div>
    </form>
  );
};

export default NumberInput;
