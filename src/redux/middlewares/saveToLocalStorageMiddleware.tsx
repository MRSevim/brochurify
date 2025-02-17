import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { saveToLocalStorage } from "@/utils/Helpers";
import {
  changeElementProp,
  changeElementStyle,
  hydrate,
} from "../slices/editorSlice";

let lastSave = 0; // Timestamp for throttling

export const saveToLocalStorageMiddleware: Middleware =
  (store) => (next) => (action) => {
    // Ignore certain actions
    if (hydrate.match(action)) {
      return next(action);
    }
    const prevState = store.getState() as RootState;
    const prevLayout = JSON.stringify(prevState.editor.layout);
    const prevPageWise = JSON.stringify(prevState.editor.pageWise);
    const prevVariables = JSON.stringify(prevState.editor.variables);
    const prevHistory = JSON.stringify(prevState.editor.history);

    const result = next(action); // Apply the action

    const nextState = store.getState() as RootState;
    const now = Date.now();

    const propOrStyleChange =
      changeElementProp.match(action) || changeElementStyle.match(action);

    if (
      JSON.stringify(nextState.editor.layout) !== prevLayout ||
      JSON.stringify(nextState.editor.pageWise) !== prevPageWise ||
      JSON.stringify(nextState.editor.variables) !== prevVariables ||
      JSON.stringify(nextState.editor.history) !== prevHistory
    ) {
      if (propOrStyleChange) {
        // Apply throttle only for style/prop changes
        if (now - lastSave > 200) {
          lastSave = now;
          saveToLocalStorage(nextState.editor);
        }
      } else {
        // Always save to storage otherwise
        saveToLocalStorage(nextState.editor);
      }
    }

    return result;
  };
