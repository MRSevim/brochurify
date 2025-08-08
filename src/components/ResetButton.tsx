import { useAppDispatch } from "@/redux/hooks";
import { changeElementStyle } from "@/redux/slices/editorSlice";
import { getPageWise } from "@/utils/Helpers";
import { memo, useCallback } from "react";
import { Style } from "@/utils/Types";

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
            })
          );
        }, [outerType, innerType])}
      />
    );
  }
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
            })
          );
        }, [type, considerPageWise])}
      />
    );
  }
);
export default ResetButton;
