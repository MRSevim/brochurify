"use client";
import { useDispatch, useSelector, useStore } from "react-redux";
import type { RootState, AppDispatch, AppStore } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

export const selectLayout = (state: RootState) => state.editor.layout;
export const selectPageWise = (state: RootState) => state.editor.pageWise;
export const selectActive = (state: RootState) => state.editor.active;
export const selectHoveredId = (state: RootState) => state.editor.hovered;
export const selectVariables = (state: RootState) => state.editor.variables;
export const selectAddLocation = (state: RootState) => state.editor.addLocation;
