import { Dispatch, SetStateAction, useEffect, useState } from "react";
import BottomLine from "../../BottomLine";
import { getSetting, getValueFromShorthandStr } from "@/utils/Helpers";
import { selectActive, useAppDispatch, useAppSelector } from "@/redux/hooks";
import ReplayButton from "../../ReplayButton";
import { triggerReplay } from "@/redux/slices/replaySlice";
import { TypeSelect } from "../Animations";
import { TransformItemPicker } from "../Transform";
import { BackgroundColorPicker } from "../Background/Background";
import {
  availableTransitions,
  filterForFixed,
  SelectTransition,
} from "./SelectTransition";
import SecondaryTitle from "@/components/SecondaryTitle";
import InfoIcon from "@/components/InfoIcon";
import AddButton from "@/components/AddButton";
import { changeElementStyle } from "@/redux/slices/editorSlice";
import EditableListItem from "../EditableListItem";
import Popup from "@/components/Popup";
import { OpacityPicker } from "../Others";
import { PositionPicker } from "../FixedSettings";
import { ShorthandTogglerPicker } from "../ShorthandToggler";
import { CONFIG } from "@/utils/Types";
import { TypeSelect as ResponsiveTypeSelect } from "../SizingAndBorder";

const Styles = () => {
  const [outerType, setOuterType] = useState("base");
  const [midType, setMidType] = useState<string>(
    CONFIG.possibleOuterTypes.scrolled
  );
  const selectorOuterType = outerType === "base" ? undefined : outerType;
  const [showPopup, setShowPopup] = useState(false);
  const dispatch = useAppDispatch();
  const [innerType, setInnerType] = useState<string>("");
  const activeId = useAppSelector(selectActive)?.id || "";
  const editedStr =
    getSetting(useAppSelector, selectorOuterType, midType, innerType) || "";
  const styles = getSetting(useAppSelector, selectorOuterType, midType);

  const activeStylesArr =
    styles && typeof styles === "object"
      ? Object.entries(styles)
          .filter(([_, value]) => value !== "")
          .map(([key]) => key)
      : [];

  const handleStyleChange = (
    innerTypeParam: string | undefined,
    newValue: string | undefined
  ) => {
    dispatch(
      changeElementStyle({
        types: [selectorOuterType, midType, innerTypeParam ?? innerType],
        newValue: newValue ?? "",
      })
    );
  };
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
      <ResponsiveTypeSelect setType={setOuterType} type={outerType} />
      <TypeSelect type={midType} setType={setMidType} />
      <AddButton
        onClick={() => {
          const typeNotActiveStyle =
            availableTransitions.find(
              (option) => !activeStylesArr.includes(option.value)
            )?.value || "transition";

          setInnerType(typeNotActiveStyle);
          setShowPopup((prev) => !prev);
        }}
      />
      {showPopup && (
        <PopupComp
          activeStylesArr={activeStylesArr}
          setInnerType={setInnerType}
          innerType={innerType}
          handleAddOrSave={(value) => {
            handleStyleChange(undefined, value);
            setShowPopup(false);
          }}
          editedStr={editedStr}
          onClose={() => {
            setShowPopup(false);
          }}
        />
      )}
      {activeStylesArr && (
        <>
          <div className="mt-2 w-full">
            {activeStylesArr.map((item, i) => (
              <EditableListItem
                key={i}
                onEditClick={() => {
                  setInnerType(activeStylesArr[i]);
                  setShowPopup(true);
                }}
                onDeleteClick={() => {
                  handleStyleChange(activeStylesArr[i], undefined);
                }}
              >
                {
                  availableTransitions.find(
                    (transition) =>
                      transition.value === getValueFromShorthandStr(item, 0)
                  )?.title
                }
              </EditableListItem>
            ))}
          </div>
        </>
      )}
      <BottomLine />
    </div>
  );
};

const PopupComp = ({
  onClose,
  handleAddOrSave,
  setInnerType,
  innerType,
  activeStylesArr,
  editedStr,
}: {
  onClose: () => void;
  setInnerType: Dispatch<SetStateAction<string>>;
  innerType: string;
  editedStr: string;
  activeStylesArr: string[];
  handleAddOrSave: (value: string) => void;
}) => {
  const [editedString, setEditedString] = useState(editedStr);
  const activeType = useAppSelector(selectActive)?.type || "";
  const editing = !!editedStr;

  useEffect(() => {
    let premadeEditedString;
    if (innerType === "translate") {
      premadeEditedString = "0px 0px";
    } else if (innerType === "rotate") {
      premadeEditedString = "0deg";
    } else if (innerType === "scale" || innerType === "opacity") {
      premadeEditedString = "1";
    } else if (
      innerType === "margin" ||
      innerType === "padding" ||
      innerType === "border-radius"
    ) {
      premadeEditedString = "0px 0px 0px 0px";
    } else {
      premadeEditedString = "";
    }
    if (!editedStr) {
      setEditedString(premadeEditedString);
    } else {
      setEditedString(editedStr);
    }
  }, [innerType, editedStr]);

  return (
    <Popup
      editing={editing}
      onClose={onClose}
      onEditOrAdd={() => {
        handleAddOrSave(editedString);
      }}
    >
      {!editing && (
        <SelectTransition
          options={availableTransitions
            .filter(
              (option) =>
                !activeStylesArr.some((t) => t.startsWith(option.value))
            )
            .filter((option) => filterForFixed(option, activeType))}
          value={innerType}
          onChange={(value) => {
            setInnerType(value);
          }}
        />
      )}
      {(innerType === "translate" ||
        innerType === "rotate" ||
        innerType === "scale") && (
        <TransformItemPicker
          type={innerType}
          onChange={(newVal) => setEditedString(newVal)}
          variableStr={editedString}
        />
      )}
      {innerType === "background-color" && (
        <BackgroundColorPicker
          variable={editedString}
          onChange={(newVal) => setEditedString(newVal)}
        />
      )}
      {innerType === "opacity" && (
        <OpacityPicker
          variable={editedString}
          onChange={(newVal) => setEditedString(newVal)}
        />
      )}
      {(innerType === "top" ||
        innerType === "left" ||
        innerType === "bottom" ||
        innerType === "right") &&
        activeType === "fixed" && (
          <PositionPicker
            type={innerType}
            variable={editedString}
            onChange={(newVal) => setEditedString(newVal)}
          />
        )}
      {(innerType === "border-radius" ||
        innerType === "padding" ||
        innerType === "margin") && (
        <ShorthandTogglerPicker
          type={innerType}
          variable={editedString}
          onChange={(newVal) => setEditedString(newVal)}
        />
      )}
      {(innerType === "width" || innerType === "height") && (
        <PositionPicker
          hasAutoOption={true}
          type={innerType}
          variable={editedString}
          onChange={(newVal) => setEditedString(newVal)}
        />
      )}
    </Popup>
  );
};

export default Styles;
