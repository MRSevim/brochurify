import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import React from "react";
import LinkInput from "@/components/LinkInput";
import { changeElementProp } from "@/features/builder/lib/redux/slices/editorSlice";
import Checkbox from "@/components/Checkbox";
import WrapperWithBottomLine from "../WrapperWithBottomLine";
import { getProp } from "../../utils/helpers";

const Url = () => {
  const type = "href";
  const variable = getProp<string>(useAppSelector, type);
  const dispatch = useAppDispatch();
  return (
    <WrapperWithBottomLine>
      <LinkInput
        title="Target url"
        desc="is the route of your button"
        value={variable || ""}
        onChange={(e) =>
          dispatch(
            changeElementProp({
              type,
              newValue: e.target.value,
            }),
          )
        }
      />
      <NewTab />
    </WrapperWithBottomLine>
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
          }),
        )
      }
    />
  );
};

export default Url;
