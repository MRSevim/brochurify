import { useAppDispatch } from "@/lib/redux/hooks";
import { changeElementStyle } from "@/features/builder/lib/redux/slices/editorSlice";
import { memo, useCallback } from "react";
import { Style } from "../utils/types/types.d";
import { getPageWise } from "../utils/helpers";

const ResetButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="flex justify-center">
      <button
        className="p-1 text-background bg-gray rounded cursor-pointer"
        onClick={onClick}
      >
        {" "}
        Reset
      </button>
    </div>
  );
};

export const ResetButtonWithOuterType = memo(
  ({ outerType, innerType }: { outerType: string; innerType: string }) => {
    const dispatch = useAppDispatch();
    return (
      <ResetButton
        onClick={useCallback(() => {
          dispatch(
            changeElementStyle({
              types: [outerType, innerType],
              newValue:
                ((getPageWise()[outerType] as Style)[innerType] as string) ||
                "",
            }),
          );
        }, [outerType, innerType])}
      />
    );
  },
);

export const ResetButtonWithType = memo(
  ({
    type,
    considerPageWise = false,
  }: {
    type: string;
    considerPageWise?: boolean;
  }) => {
    const dispatch = useAppDispatch();
    return (
      <ResetButton
        onClick={useCallback(() => {
          const newValue = considerPageWise
            ? (getPageWise()[type] as string) || ""
            : "";
          dispatch(
            changeElementStyle({
              types: [type],
              newValue,
            }),
          );
        }, [type, considerPageWise])}
      />
    );
  },
);
export default ResetButton;
