import { Dispatch, SetStateAction, useEffect, useState } from "react";
import BottomLine from "../../BottomLine";
import {
  convertVarIdsToVarNames,
  getSetting,
  getValueFromShorthandStr,
} from "@/utils/Helpers";
import {
  selectActive,
  selectPageWise,
  useAppDispatch,
  useAppSelector,
} from "@/redux/hooks";
import ReplayButton from "../../ReplayButton";
import { triggerReplay } from "@/redux/slices/replaySlice";
import { TypeSelect } from "../Animations";
import { TransformItemPicker } from "../Transform";
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
import { CONFIG, Style } from "@/utils/Types";
import { TypeSelect as ResponsiveTypeSelect } from "../SizingAndBorder";
import ColorPicker from "@/components/ColorPicker";

const Styles = () => {
  const [outerType, setOuterType] = useState("base");
  const [midType, setMidType] = useState<string>(
    CONFIG.possibleOuterTypes.scrolled
  );
  const selectorOuterType = outerType === "base" ? undefined : outerType;
  const dispatch = useAppDispatch();
  const [innerType, setInnerType] = useState<string>("");
  const activeId = useAppSelector(selectActive)?.id || "";
  const editedStr =
    getSetting(useAppSelector, selectorOuterType, midType, innerType) || "";
  const styles = getSetting<Style>(useAppSelector, selectorOuterType, midType);

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
      <TransitionValueAddZone
        handleChange={handleStyleChange}
        styles={styles}
        editedStr={editedStr}
        innerType={innerType}
        setInnerType={setInnerType}
      />
      <BottomLine />
    </div>
  );
};

const TransitionValueAddZone = ({
  styles,
  editedStr,
  innerType,
  setInnerType,
  handleChange,
}: {
  styles: Style;
  editedStr: string;
  setInnerType: Dispatch<SetStateAction<string>>;
  innerType: string;
  handleChange: (
    innerTypeParam: string | undefined,
    newValue: string | undefined
  ) => void;
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const activeStyles =
    styles && typeof styles === "object"
      ? Object.entries(styles).filter(([_, value]) => value !== "")
      : [];

  const activeStyleKeys = activeStyles.map(([key]) => key);

  const activeStylesFiltered = activeStyles.map(([key, value]) =>
    value && typeof value === "string" && value?.startsWith("var") ? value : key
  );
  const activeStylesArr = convertVarIdsToVarNames(
    activeStylesFiltered,
    useAppSelector
  );
  return (
    <>
      <AddButton
        onClick={() => {
          const typeNotActiveStyle =
            availableTransitions.find(
              (option) => !activeStyleKeys.includes(option.value)
            )?.value || "transition";

          setInnerType(typeNotActiveStyle);
          setShowPopup((prev) => !prev);
        }}
      />
      {showPopup && (
        <PopupComp
          activeStylesArr={activeStyleKeys}
          setInnerType={setInnerType}
          innerType={innerType}
          handleAddOrSave={(value) => {
            handleChange(undefined, value);
            setShowPopup(false);
          }}
          editedStr={editedStr}
          onClose={() => {
            setShowPopup(false);
          }}
        />
      )}
      {activeStylesArr && (
        <div className="mt-2 w-full">
          {activeStylesArr.map((item, i) => {
            const isVar = activeStylesFiltered[i].startsWith("var");
            return (
              <EditableListItem
                key={i}
                onEditClick={() => {
                  setInnerType(activeStylesArr[i]);
                  setShowPopup(true);
                }}
                showEditButton={!isVar}
                onDeleteClick={() => {
                  handleChange(activeStyleKeys[i], undefined);
                }}
              >
                {isVar
                  ? item
                  : availableTransitions.find(
                      (transition) =>
                        transition.value === getValueFromShorthandStr(item, 0)
                    )?.title}
              </EditableListItem>
            );
          })}
        </div>
      )}
    </>
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
  const editing = !!editedStr;

  return (
    <Popup
      editing={editing}
      onClose={onClose}
      onEditOrAdd={() => {
        handleAddOrSave(editedString);
      }}
    >
      <TransitionValueInner
        editing={editing}
        innerType={innerType}
        setInnerType={setInnerType}
        activeStylesArr={activeStylesArr}
      >
        <TransitionTypeSettings
          innerType={innerType}
          editedStr={editedStr}
          setEditedString={setEditedString}
          editedString={editedString}
        />
      </TransitionValueInner>
    </Popup>
  );
};

const TransitionValueInner = ({
  innerType,
  setInnerType,
  activeStylesArr,
  editing,
  children,
}: {
  editing: boolean;
  setInnerType: Dispatch<SetStateAction<string>>;
  innerType: string;
  activeStylesArr?: string[];
  children: React.ReactNode;
}) => {
  const activeType = useAppSelector(selectActive)?.type || "";

  return (
    <>
      {" "}
      {!editing && (
        <SelectTransition
          options={
            activeStylesArr
              ? availableTransitions
                  .filter(
                    (option) =>
                      !activeStylesArr.some((t) => t.startsWith(option.value))
                  )
                  .filter((option) => filterForFixed(option, activeType))
              : availableTransitions
          }
          value={innerType}
          onChange={(value) => {
            setInnerType(value);
          }}
        />
      )}
      {children}
    </>
  );
};

export const TransitionTypeSettings = ({
  innerType,
  editedString,
  setEditedString,
  editedStr,
  variableCreator = false,
}: {
  setEditedString: Dispatch<SetStateAction<string>>;
  variableCreator?: boolean;
  innerType: string;
  editedStr: string;
  editedString: string;
}) => {
  const pageWise = useAppSelector(selectPageWise);
  const activeType = useAppSelector(selectActive)?.type || "";

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
      innerType === "border-radius" ||
      innerType === "margin/padding"
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
    <>
      {" "}
      {(innerType === "translate" ||
        innerType === "rotate" ||
        innerType === "scale") && (
        <TransformItemPicker
          variablesAvailable={!variableCreator}
          type={innerType}
          onChange={(newVal) => setEditedString(newVal)}
          variableStr={editedString}
        />
      )}
      {(innerType === "background-color" || innerType === "color") && (
        <ColorPicker
          title="Select color"
          selected={editedString || pageWise[innerType] || "#000000"}
          onChange={(newVal) => setEditedString(newVal)}
        />
      )}
      {innerType === "opacity" && (
        <OpacityPicker
          variablesAvailable={!variableCreator}
          variable={editedString}
          onChange={(newVal) => setEditedString(newVal)}
        />
      )}
      {(((innerType === "top" ||
        innerType === "left" ||
        innerType === "bottom" ||
        innerType === "right") &&
        activeType === "fixed" &&
        !variableCreator) ||
        innerType === "distance") && (
        <PositionPicker
          variablesAvailable={!variableCreator}
          type={innerType}
          variable={editedString}
          onChange={(newVal) => setEditedString(newVal)}
        />
      )}
      {(innerType === "border-radius" ||
        innerType === "padding" ||
        innerType === "margin" ||
        innerType === "margin/padding") && (
        <ShorthandTogglerPicker
          variablesAvailable={!variableCreator}
          type={innerType}
          variable={editedString}
          onChange={(newVal) => setEditedString(newVal)}
        />
      )}
      {(innerType === "width" ||
        innerType === "height" ||
        innerType === "width/height") && (
        <PositionPicker
          hasAutoOption={true}
          type={innerType}
          variable={editedString}
          onChange={(newVal) => setEditedString(newVal)}
        />
      )}
    </>
  );
};

export default Styles;
