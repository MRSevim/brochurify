"use client";
import { useDispatch, useSelector, useStore } from "react-redux";
import type { RootState, AppDispatch, AppStore } from "./store";
import { findElementById } from "@/utils/EditorHelpers";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export const selectLayout = (state: RootState) => state.editor.layout;
export const selectPageWise = (state: RootState) => state.editor.pageWise;
export const selectActive = (state: RootState) => state.editor.active;
export const selectActiveType = (state: RootState) => {
  return findElementById(state.editor.layout, state.editor.active)?.type;
};
export const selectHovered = (state: RootState) => state.editor.hovered;
export const selectDraggedOver = (state: RootState) => state.editor.draggedOver;
export const selectVariables = (state: RootState) => state.editor.variables;
export const selectAddLocation = (state: RootState) => state.editor.addLocation;
export const selectProjectId = (state: RootState) => state.editor.id;
