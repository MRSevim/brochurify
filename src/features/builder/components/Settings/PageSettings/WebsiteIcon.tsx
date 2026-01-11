import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { getSetting } from "@/utils/Helpers";
import React from "react";
import LinkInput from "@/components/LinkInput";
import { changeElementStyle } from "@/features/builder/lib/redux/slices/editorSlice";
import UploadWrapper from "../UploadWrapper";

const WebsiteIcon = () => {
  const type = "iconUrl";
  const variable = getSetting(useAppSelector, type);
  const dispatch = useAppDispatch();
  return (
    <>
      <p className="mb-2 font-bold">Website's favicon</p>
      <UploadWrapper
        icon={true}
        onEditOrAdd={(newValue) => {
          dispatch(
            changeElementStyle({
              types: [type],
              newValue,
            })
          );
        }}
      >
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
      </UploadWrapper>
    </>
  );
};
export default WebsiteIcon;
