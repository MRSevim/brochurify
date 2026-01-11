import { useAppDispatch } from "@/lib/redux/hooks";
import React, { useRef, useState } from "react";
import Icon from "@/components/Icon";
import {
  deleteElement,
  duplicate,
  moveToNextOrPrevious,
} from "@/features/builder/lib/redux/slices/editorSlice";
import { useEditorRef } from "@/features/builder/utils/contexts/EditorRefContext";
import usePositionListener from "@/features/builder/utils/hooks/usePositionListener";

const EditorActions = ({ id, type }: { id: string; type: string }) => {
  const dispatch = useAppDispatch();
  const isColumn = type === "column";
  const [translateY, setTranslateY] = useState<number>(0);
  const [translateX, setTranslateX] = useState<number>(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const editorRef = useEditorRef();

  const updateActionsPosition = () => {
    if (ref.current && editorRef.current) {
      const actionsRect = ref.current.getBoundingClientRect();
      const editorRect = editorRef.current.getBoundingClientRect();
      let offset = 0;
      if (actionsRect.top < editorRect.top) {
        offset = editorRect.top - actionsRect.top; // push down
      } else if (actionsRect.bottom > editorRect.bottom) {
        offset = editorRect.bottom - actionsRect.bottom; // pull up
      }

      setTranslateY(offset);

      if (actionsRect.left < editorRect.left)
        setTranslateX(editorRect.left - actionsRect.left);
    }
  };
  usePositionListener(updateActionsPosition);

  const icons = [
    {
      type: isColumn ? "arrow-left" : "arrow-up",
      title: "Move to previous location",
      onClick: () => {
        dispatch(moveToNextOrPrevious({ id, location: "previous" }));
      },
    },
    {
      type: isColumn ? "arrow-right" : "arrow-down",
      title: "Move to next location",
      onClick: () => {
        dispatch(moveToNextOrPrevious({ id, location: "next" }));
      },
    },
    {
      type: "copy",
      title: "Duplicate element",
      onClick: () => {
        dispatch(duplicate(id));
      },
    },
    {
      type: "trash",
      title: "Delete element",
      onClick: () => {
        dispatch(deleteElement(id));
      },
    },
  ];

  return (
    <div
      ref={ref}
      className="absolute editor-actions right-0 flex flex-col z-[70] min-w-[26px]"
      style={{
        transform: `translate(${translateX}px,${translateY}px)`,
        transition: "transform 0.2s ease",
      }}
    >
      {icons.map((icon) => (
        <div
          key={icon.type}
          className={
            "p-1 rounded text-lg editor-action " +
            (icon.type === "trash" ? "bg-deleteRed" : "bg-background")
          }
          style={{ fontFamily: "Roboto Mono, Roboto Mono Fallback" }}
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
