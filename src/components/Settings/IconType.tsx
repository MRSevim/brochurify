import { selectPageWise, useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getProp, getSetting } from "@/utils/Helpers";
import iconList from "bootstrap-icons/font/bootstrap-icons.json";
import BottomLine from "../BottomLine";
import {
  changeElementProp,
  changeElementStyle,
  removeElementStyle,
} from "@/redux/slices/editorSlice";
import Icon from "../Icon";
import { useState } from "react";
import ToggleVisibilityWrapper from "../ToggleVisibilityWrapper";
import ColorPicker from "../ColorPicker";
import ResetButton from "../ResetButton";

const IconType = () => {
  const [searchString, setSearchString] = useState("");

  return (
    <ToggleVisibilityWrapper title="Icon Settings">
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
      <IconColor />
    </ToggleVisibilityWrapper>
  );
};

const IconColor = () => {
  const type = "color";
  const pageWise = useAppSelector(selectPageWise);
  const colorStr = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();
  return (
    <div className="relative mb-2 pb-2">
      <ColorPicker
        title="Pick the icon color"
        selected={colorStr || pageWise.color || "#000000"}
        onChange={(newValue) =>
          dispatch(changeElementStyle({ type, newValue }))
        }
      />
      <ResetButton
        onClick={() => {
          dispatch(
            removeElementStyle({
              type,
            })
          );
        }}
      />
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
            "flex flex-col items-center text-center cursor-pointer rounded hover:shadow-sm hover:shadow-gray hover:z-50 " +
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
