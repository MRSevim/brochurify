import { ChangeEvent } from "react";
import InfoIcon from "./InfoIcon";

const LinkInput = ({
  title,
  value,
  onChange,
  desc,
}: {
  title: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  desc?: string;
}) => {
  return (
    <form className="mb-2">
      <div className="flex justify-between">
        <label
          htmlFor={"link-input-" + title}
          className="block mb-2 text-sm font-medium"
        >
          {title}
        </label>
        <InfoIcon
          text={`
              This should start with https:// or # for anchors 
              ${desc ? "and " + desc : ""}
            `}
        />
      </div>
      <input
        type="url"
        id={"link-input-" + title}
        value={value}
        onChange={onChange}
        className="text-sm rounded-lg block w-full p-2.5"
      />
    </form>
  );
};

export default LinkInput;
