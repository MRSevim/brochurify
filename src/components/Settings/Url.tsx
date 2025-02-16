import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getProp } from "@/utils/Helpers";
import React from "react";
import LinkInput from "../LinkInput";
import { changeElementProp } from "@/redux/slices/editorSlice";
import BottomLine from "../BottomLine";
import Checkbox from "../Checkbox";
import SmallText from "../SmallText";

const Url = () => {
  const type = "href";
  const variable = getProp<string>(useAppSelector, type);
  const dispatch = useAppDispatch();
  return (
    <div className="relative pb-2 mb-2">
      <SmallText>Point out where you want your button to go</SmallText>
      <LinkInput
        title="Target url"
        value={variable || ""}
        onChange={(e) =>
          dispatch(
            changeElementProp({
              type,
              newValue: e.target.value,
            })
          )
        }
      />
      <NewTab />
      <BottomLine />
    </div>
  );
};
const NewTab = () => {
  const type = "newTab";
  const variable = getProp<boolean>(useAppSelector, type);
  const dispatch = useAppDispatch();
  return (
    <Checkbox
      title="Open in new tab"
      checked={variable || false}
      onChange={() =>
        dispatch(
          changeElementProp({
            type,
            newValue: !variable,
          })
        )
      }
    />
  );
};

export default Url;
