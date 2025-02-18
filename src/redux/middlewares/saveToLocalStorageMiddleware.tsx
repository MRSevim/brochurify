import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { saveToLocalStorage } from "@/utils/Helpers";
import { hydrate } from "../slices/editorSlice";
import { saved, saving } from "../slices/popupSlice";

let debounceTimer: NodeJS.Timeout | null = null; // Timer for debounce

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

    if (
      JSON.stringify(nextState.editor.layout) !== prevLayout ||
      JSON.stringify(nextState.editor.pageWise) !== prevPageWise ||
      JSON.stringify(nextState.editor.variables) !== prevVariables ||
      JSON.stringify(nextState.editor.history) !== prevHistory
    ) {
      // Clear previous debounce timer if exists
      store.dispatch(saving());
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      // Set a new debounce timer
      debounceTimer = setTimeout(() => {
        saveToLocalStorage(nextState.editor);
        store.dispatch(saved());
        debounceTimer = null; // Reset timer
      }, 1000);
    }

    return result;
  };
