import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getSetting } from "@/utils/Helpers";
import React from "react";
import LinkInput from "@/components/LinkInput";
import { changeElementStyle } from "@/redux/slices/editorSlice";
import BottomLine from "@/components/BottomLine";

const WebsiteIcon = () => {
  const type = "iconUrl";
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();
  return (
    <div className="relative pb-2 mb-2">
      <LinkInput
        title="Favicon url"
        value={variable || ""}
        onChange={(e) =>
          dispatch(
            changeElementStyle({
              types: [type],
              newValue: e.target.value,
            })
          )
        }
      />
      <BottomLine />
    </div>
  );
};
export default WebsiteIcon;
