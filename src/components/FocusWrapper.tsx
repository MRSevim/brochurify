import {
  setActive,
  setDraggedItem,
  setHovered,
} from "@/redux/slices/editorSlice";
import { selectActive, useAppDispatch, useAppSelector } from "@/redux/hooks";
import { memo } from "react";

const FocusWrapper = memo(
  ({ id, children }: { id: string; children: React.ReactNode }) => {
    const dispatch = useAppDispatch();
    const activeId = useAppSelector(selectActive);
    console.log("focuswrapper rendered ", id);

    return (
      <div
        className="cursor-pointer w-full h-full"
        key={id}
        draggable
        onMouseOver={(e) => {
          e.stopPropagation();
          dispatch(setHovered(id));
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          dispatch(setHovered(undefined));
        }}
        onDragStart={(e) => {
          e.stopPropagation();
          dispatch(setDraggedItem(id));
        }}
        onDragEnd={(e) => {
          e.stopPropagation();
          dispatch(setDraggedItem(undefined));
        }}
        tabIndex={0}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (activeId === id) {
            dispatch(setActive(undefined));
          } else dispatch(setActive(id));
        }}
      >
        {children}
      </div>
    );
  }
);

export default FocusWrapper;
