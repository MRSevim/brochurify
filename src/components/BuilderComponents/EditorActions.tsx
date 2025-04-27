import { useAppDispatch } from "@/redux/hooks";
import { Layout } from "@/utils/Types";
import React, { useRef, useState } from "react";
import Icon from "../Icon";
import {
  deleteElement,
  duplicate,
  moveToNextOrPrevious,
} from "@/redux/slices/editorSlice";
import { useEditorRef } from "@/contexts/EditorRefContext";
import usePositionListener from "@/utils/hooks/usePositionListener";

const EditorActions = ({ item }: { item: Layout }) => {
  const dispatch = useAppDispatch();
  const isColumn = item.type === "column";
  const [marginTop, setMarginTop] = useState<number>(0);
  const [marginLeft, setMarginLeft] = useState<number>(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const editorRef = useEditorRef();

  const updateActionsPosition = () => {
    if (ref.current && editorRef.current) {
      const actionsRect = ref.current.getBoundingClientRect();
      const editorRect = editorRef.current.getBoundingClientRect();
      // Clear margin
      let newMarginTop = 0;

      if (actionsRect.top <= editorRect.top) {
        newMarginTop = editorRect.top - actionsRect.top; // push down if too close to top
      } else if (actionsRect.bottom >= editorRect.bottom) {
        newMarginTop = -(actionsRect.bottom - editorRect.bottom); // Pull up slightly if near the bottom
      }

      setMarginTop(newMarginTop);
    }
  };
  usePositionListener(updateActionsPosition);

  const icons = [
    {
      type: isColumn ? "arrow-left" : "arrow-up",
      title: "Move to previous location",
      onClick: () => {
        dispatch(moveToNextOrPrevious({ item, location: "previous" }));
      },
    },
    {
      type: isColumn ? "arrow-right" : "arrow-down",
      title: "Move to next location",
      onClick: () => {
        dispatch(moveToNextOrPrevious({ item, location: "next" }));
      },
    },
    {
      type: "copy",
      title: "Duplicate element",
      onClick: () => {
        dispatch(duplicate(item));
      },
    },
    {
      type: "trash",
      title: "Delete element",
      onClick: () => {
        dispatch(deleteElement(item.id));
      },
    },
  ];

  return (
    <div
      ref={ref}
      className="absolute editor-actions right-0 flex flex-col z-[70]"
      style={{ marginTop: "100px", marginLeft }}
    >
      {icons.map((icon) => (
        <div
          key={icon.type}
          className={
            "p-1 rounded editor-action " +
            (icon.type === "trash" ? "bg-red-800" : "bg-background")
          }
          onClick={(e) => {
            e.stopPropagation();
            icon.onClick();
          }}
        >
          <Icon
            title={icon.title}
            type={icon.type}
            size="18px"
            onClick={() => {}}
          />
        </div>
      ))}
    </div>
  );
};

export default EditorActions;
