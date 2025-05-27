import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getSetting } from "@/utils/Helpers";
import React from "react";
import LinkInput from "@/components/LinkInput";
import { changeElementStyle } from "@/redux/slices/editorSlice";
import WrapperWithBottomLine from "@/components/WrapperWithBottomLine";

const WebsiteIcon = () => {
  const type = "iconUrl";
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();
  return (
    <WrapperWithBottomLine>
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
    </WrapperWithBottomLine>
  );
};
export default WebsiteIcon;
