import { StringOrUnd } from "@/utils/Types";
import { useState } from "react";
import SmallText from "./SmallText";
import Popup from "./Popup";
import { selectVariables, useAppSelector } from "@/redux/hooks";

const addVarAtStart = (str: StringOrUnd) => `var(--${str})`;
const parseSelectedVars = (value: string) =>
  value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

const VariableSelector = ({
  variablesBehaveAsArray = false,
  selected,
  type,
  onChange,
}: {
  type: string;
  selected: string;
  variablesBehaveAsArray?: boolean;
  onChange: (newVal: string) => void;
}) => {
  const [varOpen, setVarOpen] = useState(false);
  const [value, setValue] = useState(selected || "");
  const availableVars = useAppSelector(selectVariables).filter(
    (item) => item.type === type
  );
  const selectedVars = parseSelectedVars(value);
  return (
    <>
      <div className="flex justify-center">
        <button
          className="p-1 my-2 border border-text rounded"
          onClick={() => setVarOpen((prev) => !prev)}
        >
          Var
        </button>
      </div>

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
                      "flex gap-3 justify-center items-center p-2 w-1/3 cursor-pointer hover:shadow-sm hover:shadow-text hover:z-50 " +
                      (selectedVars.includes(addVarAtStart(item.id)) &&
                        "shadow-sm shadow-text z-50 ring-2 ring-text")
                    }
                    onClick={() => {
                      const added = addVarAtStart(item.id);
                      if (variablesBehaveAsArray) {
                        if (selectedVars.includes(added)) {
                          setValue(
                            selectedVars.filter((v) => v !== added).join(",")
                          );
                        } else {
                          setValue([...selectedVars, added].join(","));
                        }
                      } else {
                        if (value === added) {
                          setValue("");
                        } else setValue(added);
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
              <SmallText text={`No variables of type ${type} is set`} />
            )}
          </div>
        </Popup>
      )}
    </>
  );
};

export default VariableSelector;
