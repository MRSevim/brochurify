import {
  selectHovered,
  selectLayout,
  useAppDispatch,
  useAppSelector,
} from "@/lib/redux/hooks";
import { useEffect } from "react";
import {
  deleteElement,
  paste,
  redo,
  setCopied,
  undo,
} from "@/features/builder/lib/redux/slices/editorSlice";
import { findElementById } from "../EditorHelpers";

export default function useKeyPresses() {
  const hoveredItem = useAppSelector(selectHovered);
  const hoveredId = !hoveredItem?.where ? hoveredItem?.id : undefined;
  const layout = useAppSelector(selectLayout);
  const dispatch = useAppDispatch();
  const hovered = findElementById(layout, hoveredId || "");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopImmediatePropagation();
      if (e.ctrlKey && e.key === "z") {
        dispatch(undo());
      } else if (e.ctrlKey && e.key === "y") {
        dispatch(redo());
      } else if (e.ctrlKey && e.key === "c") {
        if (hovered) {
          dispatch(setCopied(hovered));
        }
      } else if (e.ctrlKey && e.key === "v") {
        dispatch(paste());
      } else if (e.key === "Delete") {
        if (hoveredId) {
          dispatch(deleteElement(hoveredId));
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hoveredId]);
}
