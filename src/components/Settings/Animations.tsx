import { Dispatch, SetStateAction, useState } from "react";
import AddButton from "../AddButton";
import SmallText from "../SmallText";
import ToggleVisibilityWrapper from "../ToggleVisibilityWrapper";
import BottomLine from "../BottomLine";
import {
  addAnimationToString,
  CONFIG,
  getSetting,
  getValueFromShorthandStr,
  makeArraySplitFromCommas,
  setValueFromShorthandStr,
  updateOrDeleteAnimationAtIndex,
} from "@/utils/Helpers";
import { selectActive, useAppDispatch, useAppSelector } from "@/redux/hooks";
import EditButton from "../EditButton";
import DeleteButton from "../DeleteButton";
import {
  changeInnerElementStyle,
  removeElementStyle,
} from "@/redux/slices/editorSlice";
import Select from "../Select";
import { OptionsObject } from "@/utils/Types";
import NumberInput from "../NumberInput";
import Checkbox from "../Checkbox";
import ReplayButton from "../ReplayButton";
import { triggerReplay } from "@/redux/slices/replaySlice";

const Animations = () => {
  const [type, setType] = useState<string>(CONFIG.possibleOuterTypes.scrolled);
  const [showPopup, setShowPopup] = useState(false);
  const innerType = "animation";
  const animationsString = getSetting(useAppSelector, type, innerType);
  const animations = makeArraySplitFromCommas(animationsString);
  const [editedIndex, setEditedIndex] = useState<number>(0);
  const dispatch = useAppDispatch();
  const activeId = useAppSelector(selectActive)?.id || "";

  const handleAddition = (editedStr: string) => {
    const newValue = addAnimationToString(animationsString || "", editedStr);
    dispatch(changeInnerElementStyle({ outerType: type, innerType, newValue }));
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
    if (!newValue) {
      dispatch(removeElementStyle({ type }));
    } else {
      dispatch(
        changeInnerElementStyle({ outerType: type, innerType, newValue })
      );
    }
  };
  return (
    <ToggleVisibilityWrapper title="Animations">
      <div className="flex flex-col items-center relative pb-2 mb-2">
        <SmallText>Add animations for this element</SmallText>
        <ReplayButton
          onClick={() => {
            dispatch(triggerReplay(activeId));
          }}
        />
        <TypeSelect type={type} setType={setType} />
        <AddButton
          onClick={() => {
            if (!showPopup) {
              handleAddition(
                "slideInFromLeft 100ms ease 0ms 1 normal none running"
              );
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
const typeArr = [
  { text: "onVisible", type: CONFIG.possibleOuterTypes.scrolled },
  { text: "onHover", type: CONFIG.possibleOuterTypes.hover },
  { text: "onClick", type: CONFIG.possibleOuterTypes.active },
];
const TypeSelect = ({
  setType,
  type,
}: {
  setType: Dispatch<SetStateAction<string>>;
  type: string;
}) => {
  return (
    <div className="flex items-center justify-between gap-2 mb-2">
      {typeArr.map((item) => (
        <TypeItem
          key={item.text}
          globalType={type}
          type={item.type}
          text={item.text}
          onClick={() => {
            setType(item.type);
          }}
        />
      ))}
    </div>
  );
};
const TypeItem = ({
  text,
  onClick,
  type,
  globalType,
}: {
  text: string;
  onClick: () => void;
  type: string;
  globalType: string;
}) => {
  return (
    <div
      className={
        "text-background  p-2 cursor-pointer " +
        (type === globalType ? " bg-gray" : "bg-text")
      }
      onClick={onClick}
    >
      {text}
    </div>
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
  if (!editedStr) return;
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
      <SelectTimingFunction
        value={getValueFromShorthandStr(editedStr, 2)}
        onChange={(value) => {
          handleChange(setValueFromShorthandStr(editedStr, 2, value));
        }}
      />
      <NumberInput
        title="Animation delay (in ms)"
        value={getValueFromShorthandStr(editedStr, 3)}
        onChange={(e) => {
          let newValue;
          if (e.target.value === "") {
            newValue = setValueFromShorthandStr(editedStr, 3, "0ms");
          } else {
            newValue = setValueFromShorthandStr(
              editedStr,
              3,
              e.target.value + "ms"
            );
          }
          handleChange(newValue);
        }}
      />
      <SetIterationCount
        value={getValueFromShorthandStr(editedStr, 4)}
        onChange={(value) => {
          handleChange(setValueFromShorthandStr(editedStr, 4, value));
        }}
      />
      <SelectDirection
        value={getValueFromShorthandStr(editedStr, 5)}
        onChange={(value) => {
          handleChange(setValueFromShorthandStr(editedStr, 5, value));
        }}
      />
      <SelectFillMode
        value={getValueFromShorthandStr(editedStr, 6)}
        onChange={(value) => {
          handleChange(setValueFromShorthandStr(editedStr, 6, value));
        }}
      />
      <Checkbox
        title="paused"
        checked={getValueFromShorthandStr(editedStr, 7) === "paused"}
        onChange={() => {
          if (getValueFromShorthandStr(editedStr, 7) === "paused") {
            handleChange(setValueFromShorthandStr(editedStr, 7, "running"));
          } else {
            handleChange(setValueFromShorthandStr(editedStr, 7, "paused"));
          }
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
    { title: "Slide in from left", value: "slideInFromLeft" },
    { title: "Slide in from right", value: "slideInFromRight" },
    { title: "Slide in from top", value: "slideInFromTop" },
    { title: "Slide in from bottom", value: "slideInFromBottom" },
    { title: "Scale up", value: "scaleUp" },
    { title: "Scale down", value: "scaleDown" },
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
const SelectTimingFunction = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (str: string) => void;
}) => {
  const availableFuncs: OptionsObject[] = [
    { title: "Start slow, middle fast, end slow (ease)", value: "ease" },
    { title: "Start slow, end fast (ease-in)", value: "ease-in" },
    { title: "Start fast, end slow (ease-out)", value: "ease-out" },
    {
      title: "Start slow, middle fast, end slow (ease-in-out)",
      value: "ease-in-out",
    },
    {
      title: "Linear speed",
      value: "linear",
    },
  ];
  return (
    <Select
      title="Animation type"
      options={availableFuncs}
      selected={value}
      showStyled={false}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
const SetIterationCount = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (str: string) => void;
}) => {
  const checked = value === "infinite";
  return (
    <>
      <NumberInput
        title="Iteration count in numbers"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
      <Checkbox
        title="infinite"
        checked={checked}
        onChange={() => {
          if (checked) {
            onChange("1");
          } else {
            onChange("infinite");
          }
        }}
      />
    </>
  );
};
const SelectDirection = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (str: string) => void;
}) => {
  const availableAnimations: string[] = [
    "normal",
    "reverse",
    "alternate",
    "alternate-reverse",
  ];
  return (
    <Select
      title="Animation direction"
      options={availableAnimations}
      selected={value}
      showStyled={false}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
const SelectFillMode = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (str: string) => void;
}) => {
  const availableModes: OptionsObject[] = [
    { title: "Do not apply any style after it ends (none)", value: "none" },
    {
      title: "Apply last frame's change to animation after it ends (forwards)",
      value: "forwards",
    },
    {
      title:
        "Apply first frame's change to animation during delay period (backwards)",
      value: "backwards",
    },
    {
      title: "Apply both forwards and backwards conditions (both)",
      value: "both",
    },
  ];
  return (
    <Select
      title="Animation end state"
      options={availableModes}
      selected={value}
      showStyled={false}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
export default Animations;
