import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getProp } from "@/utils/Helpers";
import iconList from "bootstrap-icons/font/bootstrap-icons.json";
import BottomLine from "../BottomLine";
import { changeElementProp } from "@/redux/slices/editorSlice";
import Icon from "../Icon";
import { useState } from "react";

const IconType = () => {
  const [searchString, setSearchString] = useState("");

  return (
    <div className="relative pb-2 mb-2">
      <form className="max-w-sm mx-auto mb-2">
        <label className="block mb-2 text-sm font-medium">Icon type</label>
        <input
          type="text"
          value={searchString}
          placeholder="Search"
          onChange={(e) => setSearchString(e.target.value)}
          className="mb-2 bg-gray-700 border border-gray-600 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full p-2.5"
        />
        <div className="w-full h-full">
          <div className="grid grid-cols-3 gap-2 max-h-80 overflow-hidden overflow-y-auto">
            <Filtered searchString={searchString} />
          </div>
        </div>
      </form>

      <BottomLine />
    </div>
  );
};

const Filtered = ({ searchString }: { searchString: string }) => {
  const type = "iconType";
  const variable = getProp<string>(useAppSelector, type);
  const dispatch = useAppDispatch();

  // Filter icons based on search input
  const filteredIcons = Object.keys(iconList).filter((icon) =>
    icon.toLowerCase().includes(searchString.toLowerCase())
  );
  return (
    <>
      {filteredIcons.map((icon) => (
        <div
          key={icon}
          onClick={() => dispatch(changeElementProp({ type, newValue: icon }))}
          className={
            "flex flex-col items-center text-center cursor-pointer " +
            (variable === icon ? " border p-1 border-text rounded" : "")
          }
        >
          <Icon title={icon} type={icon} size="24px" onClick={() => {}} />
          <span className="text-xs">{icon}</span>
        </div>
      ))}
    </>
  );
};

export default IconType;
