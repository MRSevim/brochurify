import { StringOrUnd } from "@/utils/Types";
import { useState } from "react";
import SmallText from "./SmallText";
import Popup from "./Popup";
import { selectVariables, useAppSelector } from "@/redux/hooks";

const addVarAtStart = (str: StringOrUnd) => `var(--${str})`;

const VariableSelector = ({
  selected,
  type,
  onChange,
}: {
  type: string;
  selected: string;
  onChange: (newVal: string) => void;
}) => {
  const [varOpen, setVarOpen] = useState(false);
  const [value, setValue] = useState(selected || "");
  const availableVars = useAppSelector(selectVariables).filter(
    (item) => item.type === type
  );
  return (
    <>
      <button
        className="p-1 mt-2 border border-text rounded"
        onClick={() => setVarOpen((prev) => !prev)}
      >
        Var
      </button>

      {varOpen && (
        <Popup
          positiveActionText="Use"
          onClose={() => setVarOpen(false)}
          loading={false}
          editing={false}
          onEditOrAdd={() => {
            onChange(value);
            setVarOpen(false);
          }}
        >
          Select your variable
          <div className="my-2">
            {availableVars.length > 0 && (
              <div className="flex flex-wrap">
                {availableVars.map((item) => (
                  <div
                    key={item.id}
                    className={
                      "flex gap-3 justify-center items-center py-2 pe-2 w-1/3 cursor-pointer hover:shadow-sm hover:shadow-text hover:z-50 " +
                      (addVarAtStart(item.id) === value &&
                        "shadow-sm shadow-text z-50 ring-2 ring-text")
                    }
                    onClick={() => {
                      const added = addVarAtStart(item.id);
                      if (value === added) {
                        setValue("");
                      } else {
                        setValue(added);
                      }
                    }}
                  >
                    {item.name}{" "}
                    {type === "color" && (
                      <div
                        className="size-5"
                        style={{ backgroundColor: item.value }}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {availableVars.length === 0 && (
              <SmallText>No variables of type {type} is set</SmallText>
            )}
          </div>
        </Popup>
      )}
    </>
  );
};

export default VariableSelector;
