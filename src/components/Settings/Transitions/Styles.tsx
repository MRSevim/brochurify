import { useState } from "react";
import BottomLine from "../../BottomLine";
import { CONFIG } from "@/utils/Helpers";
import { selectActive, useAppDispatch, useAppSelector } from "@/redux/hooks";
import ReplayButton from "../../ReplayButton";
import { triggerReplay } from "@/redux/slices/replaySlice";
import { TypeSelect } from "../Animations";
import { TransformItem } from "../Transform";
import { BackgroundColor } from "../Background/Background";
import { SelectTransition } from "./Transitions";
import SecondaryTitle from "@/components/SecondaryTitle";
import InfoIcon from "@/components/InfoIcon";

const Styles = () => {
  const [outerType, setOuterType] = useState<string>(
    CONFIG.possibleOuterTypes.scrolled
  );
  const dispatch = useAppDispatch();
  const [editedProperty, setEditedProperty] = useState("translate");
  const activeId = useAppSelector(selectActive)?.id || "";

  return (
    <div className="flex flex-col items-center relative pb-2 mb-2">
      <SecondaryTitle title="Transitioned styles">
        <InfoIcon text="Apply styles for specified classes. You can change transition properties from above." />
      </SecondaryTitle>
      <ReplayButton
        onClick={() => {
          dispatch(triggerReplay(activeId));
        }}
      />
      <TypeSelect type={outerType} setType={setOuterType} />

      <SelectTransition
        value={editedProperty}
        onChange={(value) => {
          setEditedProperty(value);
        }}
      />
      {(editedProperty === "translate" ||
        editedProperty === "rotate" ||
        editedProperty === "scale") && (
        <TransformItem type={editedProperty} outerType={outerType} />
      )}
      {editedProperty === "background-color" && (
        <BackgroundColor outerType={outerType} />
      )}

      <BottomLine />
    </div>
  );
};

export default Styles;
