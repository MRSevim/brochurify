import React from "react";
import ToggleVisibilityWrapper from "../ToggleVisibilityWrapper";
import TextInput from "../TextInput";
import { getProp } from "@/utils/Helpers";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { changeElementProp } from "@/redux/slices/editorSlice";
import WrapperWithBottomLine from "../WrapperWithBottomLine";

const Anchor = () => {
  const type = "anchorId";
  const variable = getProp<string>(useAppSelector, type);
  const dispatch = useAppDispatch();

  return (
    <ToggleVisibilityWrapper
      title="Anchor"
      desc="Add anchor to your element so you can link to it later. Name should be unique for each element with anchor"
    >
      <WrapperWithBottomLine>
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
      </WrapperWithBottomLine>
    </ToggleVisibilityWrapper>
  );
};

export default Anchor;
