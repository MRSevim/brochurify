import { DragEvent } from "react";
import { useAppDispatch } from "@/redux/hooks";
import {
  handleCenterDragOver,
  handleCenterDrop,
  handleDragLeave,
  handleSideDragOver,
  handleSideDrop,
} from "@/redux/slices/editorSlice";
import { LayoutOrUnd, Where } from "./Types";

export const handleSideDropCaller = (
  e: DragEvent<HTMLElement>,
  dispatch: ReturnType<typeof useAppDispatch>,
  id: string
) => {
  e.preventDefault();
  dispatch(handleSideDrop(id));
};
export const handleCenterDropCaller = (
  e: DragEvent<HTMLElement>,
  dispatch: ReturnType<typeof useAppDispatch>,
  id: string
) => {
  e.preventDefault();
  dispatch(handleCenterDrop(id));
};
export const handleSideDragOverCaller = ({
  e,
  id,
  where,
  dispatch,
}: {
  id: string;
  e: DragEvent<HTMLElement>;
  where: Where;
  dispatch: ReturnType<typeof useAppDispatch>;
}) => {
  e.preventDefault();
  dispatch(handleSideDragOver({ addLocation: { id, where } }));
};
export const handleCenterDragOverCaller = (
  e: DragEvent<HTMLElement>,
  item: LayoutOrUnd,
  dispatch: ReturnType<typeof useAppDispatch>
) => {
  e.preventDefault();
  dispatch(handleCenterDragOver(item));
};
export const handleDragLeaveCaller = (
  dispatch: ReturnType<typeof useAppDispatch>
) => {
  dispatch(handleDragLeave());
};
