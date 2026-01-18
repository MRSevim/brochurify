import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getSetting, outerTypeArr } from "@/utils/Helpers";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import ReplayButton from "../../ReplayButton";
import { triggerReplay } from "@/features/builder/lib/redux/slices/replaySlice";
import {
  availableTransitions,
  filterForFixed,
  SelectTransition,
  TransitionTypeSettings,
} from "./SelectTransition";
import SecondaryTitle from "@/components/SecondaryTitle";
import InfoIcon from "@/components/InfoIcon";
import AddButton from "@/components/AddButton";
import { changeElementStyle } from "@/features/builder/lib/redux/slices/editorSlice";
import EditableListItem from "../EditableListItem";
import Popup from "@/components/Popup";
import { CONFIG, Style } from "@/utils/types/Types";
import { TypeSelect as ResponsiveTypeSelect } from "../SizingAndBorder";
import WrapperWithBottomLine from "@/features/builder/components/WrapperWithBottomLine";
import {
  selectActive,
  selectActiveType,
} from "@/features/builder/lib/redux/selectors";

const Styles = () => {
  const [outerType, setOuterType] = useState("base");
  const [midType, setMidType] = useState<string>(
    CONFIG.possibleOuterTypes.scrolled,
  );
  const selectorOuterType = outerType === "base" ? undefined : outerType;
  const dispatch = useAppDispatch();
  const [innerType, setInnerType] = useState<string>("");
  const activeId = useAppSelector(selectActive) || "";
  const editedStr =
    getSetting(useAppSelector, selectorOuterType, midType, innerType) || "";
  const styles = getSetting<Style>(useAppSelector, selectorOuterType, midType);

  const handleStyleChange = (
    innerTypeParam: string | undefined,
    newValue: string | undefined,
  ) => {
    dispatch(
      changeElementStyle({
        types: [selectorOuterType, midType, innerTypeParam ?? innerType],
        newValue: newValue ?? "",
      }),
    );
  };
  return (
    <WrapperWithBottomLine flex={true}>
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
    </WrapperWithBottomLine>
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
    newValue: string | undefined,
  ) => void;
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const activeStyles =
    styles && typeof styles === "object"
      ? Object.entries(styles).filter(([_, value]) => value !== "")
      : [];

  const activeStyleKeys = activeStyles.map(([key]) => key);

  return (
    <>
      <AddButton
        onClick={() => {
          const firstNonActiveStyle =
            availableTransitions.find(
              (option) => !activeStyleKeys.includes(option.value),
            )?.value || "translate";

          setInnerType(firstNonActiveStyle);
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
      {activeStyles && (
        <div className="mt-2 w-full">
          {activeStyles.map((item, i) => {
            return (
              <EditableListItem
                key={i}
                onEditClick={() => {
                  setInnerType(item[0]);
                  setShowPopup(true);
                }}
                showEditButton={true}
                onDeleteClick={() => {
                  handleChange(item[0], undefined);
                }}
              >
                {
                  availableTransitions.find(
                    (transition) => transition.value === item[0],
                  )?.title
                }
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
  activeStylesArr: string[];
  children: React.ReactNode;
}) => {
  const activeType = useAppSelector(selectActiveType) || "";

  return (
    <>
      {" "}
      {!editing && (
        <SelectTransition
          options={
            activeStylesArr.length
              ? availableTransitions
                  .filter(
                    (option) =>
                      !activeStylesArr.some((t) => t.startsWith(option.value)),
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

export const TypeSelect = ({
  setType,
  type,
}: {
  setType: Dispatch<SetStateAction<string>>;
  type: string;
}) => {
  return (
    <div className="flex items-center justify-between gap-2 mb-2">
      {outerTypeArr.map((item) => (
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

export default Styles;
