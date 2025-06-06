import { ChangeEvent } from "react";
import InfoIcon from "./InfoIcon";

const TextInput = ({
  title,
  value,
  desc,
  onChange,
}: {
  title: string;
  value: string;
  desc?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <form className="mb-2">
      <div className="flex justify-between">
        <label
          htmlFor={"text-input-" + title}
          className="block mb-2 text-sm font-medium"
        >
          {title}
        </label>
        {desc && <InfoIcon text={desc} />}
      </div>
      <input
        type="text"
        id={"text-input-" + title}
        value={value}
        onChange={onChange}
        className="text-sm rounded-lg block w-full p-2.5"
      />
    </form>
  );
};

export default TextInput;
