import { useState } from "react";
import AddButton from "../AddButton";
import SmallText from "../SmallText";
import ToggleVisibilityWrapper from "../ToggleVisibilityWrapper";
import BottomLine from "../BottomLine";
import {
  addAnimationToString,
  getSetting,
  getValueFromShorthandStr,
  makeArraySplitFromCommas,
  setValueFromShorthandStr,
  updateOrDeleteAnimationAtIndex,
} from "@/utils/Helpers";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import EditButton from "../EditButton";
import DeleteButton from "../DeleteButton";
import { changeElementStyle } from "@/redux/slices/editorSlice";
import Select from "../Select";
import { OptionsObject } from "@/utils/Types";
import NumberInput from "../NumberInput";

const Animations = () => {
  const type = "animation";
  const [showPopup, setShowPopup] = useState(false);
  const animationsString = getSetting(useAppSelector, type);
  const animations = makeArraySplitFromCommas(animationsString);
  const [editedIndex, setEditedIndex] = useState<number>(0);
  const dispatch = useAppDispatch();

  const handleAddition = (editedStr: string) => {
    const newValue = addAnimationToString(animationsString || "", editedStr);
    dispatch(changeElementStyle({ type, newValue }));
  };

  const handleEditOrDeletion = (
    i: number,
    deletion: boolean,
    animation: string | undefined
  ) => {
    if (!animationsString) return;
    const newValue = updateOrDeleteAnimationAtIndex(
      animationsString,
      animation,
      i,
      deletion
    );
    dispatch(changeElementStyle({ type, newValue }));
  };
  return (
    <ToggleVisibilityWrapper title="Animations">
      <div className="flex flex-col items-center relative pb-2 mb-2">
        <SmallText>Add animations for this element</SmallText>
        <AddButton
          onClick={() => {
            if (!showPopup) {
              handleAddition("slideIn 100ms");
            }
            setShowPopup((prev) => !prev);
          }}
        />
        {showPopup && (
          <Popup
            handleEdit={(i, value) => {
              handleEditOrDeletion(i, false, value);
            }}
            editedIndex={editedIndex}
            editedStr={animations[editedIndex]}
            onClose={() => {
              setEditedIndex(0);
              setShowPopup(false);
            }}
          />
        )}
        {animations && (
          <AnimationsList
            animations={animations}
            onEditClick={(i) => {
              setEditedIndex(i);
              setShowPopup(true);
            }}
            onDeleteClick={(i) => {
              handleEditOrDeletion(i, true, undefined);
            }}
          />
        )}
        <BottomLine />
      </div>
    </ToggleVisibilityWrapper>
  );
};
const Popup = ({
  onClose,
  handleEdit,
  editedStr,
  editedIndex,
}: {
  onClose: () => void;
  editedStr: string;
  editedIndex: number;
  handleEdit: (i: number, value: string) => void;
}) => {
  const handleChange = (value: string) => {
    handleEdit(editedIndex, value);
  };

  return (
    <div className="absolute z-10 w-full bg-background border border-text rounded p-3 top-5">
      <SelectAnimation
        value={getValueFromShorthandStr(editedStr, 0)}
        onChange={(value) => {
          handleChange(setValueFromShorthandStr(editedStr, 0, value));
        }}
      />
      <NumberInput
        title="Animation duration (in ms)"
        value={getValueFromShorthandStr(editedStr, 1)}
        onChange={(e) => {
          handleChange(
            setValueFromShorthandStr(editedStr, 1, e.target.value + "ms")
          );
        }}
      />
      <div className="flex justify-center gap-2">
        <button
          className="p-1 text-background bg-gray rounded cursor-pointer"
          onClick={onClose}
        >
          {" "}
          Close
        </button>
      </div>
    </div>
  );
};
const AnimationsList = ({
  onEditClick,
  onDeleteClick,
  animations,
}: {
  onEditClick: (i: number) => void;
  onDeleteClick: (i: number) => void;
  animations: string[];
}) => {
  return (
    <div className="mt-2 w-full">
      {animations.map((animation, i) => (
        <div
          key={i}
          className="flex justify-between items-center border border-text p-2 m-2"
        >
          <div className="px-2">
            <span className="pe-2 border-r-2">Animation {i}</span>
          </div>
          <div className="flex gap-1">
            <EditButton onClick={() => onEditClick(i)} />
            <DeleteButton onClick={() => onDeleteClick(i)} />
          </div>
        </div>
      ))}
    </div>
  );
};

const SelectAnimation = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (str: string) => void;
}) => {
  const availableAnimations: OptionsObject[] = [
    { title: "Slide in", value: "slideIn" },
  ];
  return (
    <Select
      title="Animation type"
      options={availableAnimations}
      selected={value}
      showStyled={false}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
export default Animations;
