import { RootState } from "@/lib/redux/store";
import { findElementById } from "@/features/builder/utils/EditorHelpers";

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
