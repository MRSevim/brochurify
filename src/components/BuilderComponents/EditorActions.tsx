import { useAppDispatch } from "@/redux/hooks";
import { Layout } from "@/utils/Types";
import React from "react";
import Icon from "../Icon";
import {
  deleteElement,
  duplicate,
  moveToNextOrPrevious,
} from "@/redux/slices/editorSlice";

const EditorActions = ({ item }: { item: Layout }) => {
  const dispatch = useAppDispatch();
  const isColumn = item.type === "column";

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
    <div className="absolute editor-actions right-0 flex flex-col z-[70]">
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
