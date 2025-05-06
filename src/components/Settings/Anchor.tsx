import React from "react";
import ToggleVisibilityWrapper from "../ToggleVisibilityWrapper";
import TextInput from "../TextInput";
import BottomLine from "../BottomLine";
import { getProp } from "@/utils/Helpers";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { changeElementProp } from "@/redux/slices/editorSlice";

const Anchor = () => {
  const type = "anchorId";
  const variable = getProp<string>(useAppSelector, type);
  const dispatch = useAppDispatch();

  return (
    <ToggleVisibilityWrapper
      title="Anchor"
      desc="Add anchor to your element so you can link to it later. Name should be unique for each element with anchor"
    >
      <div className="relative pb-2 mb-2">
        <TextInput
          title="Anchor name"
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
        <BottomLine />
      </div>
    </ToggleVisibilityWrapper>
  );
};

export default Anchor;
