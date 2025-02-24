import { ChangeEvent } from "react";

const LinkInput = ({
  title,
  value,
  onChange,
}: {
  title: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <form className="mb-2">
      <label
        htmlFor={"link-input-" + title}
        className="block mb-2 text-sm font-medium"
      >
        {title}
      </label>
      <input
        type="url"
        id={"link-input-" + title}
        value={value}
        onChange={onChange}
        className="bg-gray-700 border border-gray-600 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
      />
    </form>
  );
};

export default LinkInput;
