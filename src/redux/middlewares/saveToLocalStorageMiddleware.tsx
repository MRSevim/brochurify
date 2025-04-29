import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { saveToLocalStorage } from "@/utils/Helpers";
import { hydrate } from "../slices/editorSlice";
import { saved, saving } from "../slices/popupSlice";

let variableTimer: NodeJS.Timeout | null = null;
let layoutHistoryTimer: NodeJS.Timeout | null = null;

export const saveToLocalStorageMiddleware: Middleware =
  (store) => (next) => (action) => {
    // Ignore certain actions
    if (hydrate.match(action)) {
      return next(action);
    }

    const prevState = store.getState() as RootState;
    const prevVariables = JSON.stringify(prevState.editor.variables);
    const prevHistory = JSON.stringify(prevState.editor.history);
    const prevLayout = JSON.stringify(prevState.editor.layout);
    const prevPageWise = JSON.stringify(prevState.editor.pageWise);

    const result = next(action);

    const nextState = store.getState() as RootState;
    const nextVariables = JSON.stringify(nextState.editor.variables);
    const nextLayout = JSON.stringify(nextState.editor.layout);
    const nextHistory = JSON.stringify(nextState.editor.history);
    const nextPageWise = JSON.stringify(nextState.editor.pageWise);

    if (nextVariables !== prevVariables) {
      if (variableTimer) clearTimeout(variableTimer);

      store.dispatch(saving());
      variableTimer = setTimeout(() => {
        saveToLocalStorage(store.getState().editor);
        store.dispatch(saved());
        variableTimer = null;
      }, 1000);
    }

    const layoutChanged =
      nextLayout !== prevLayout || nextPageWise !== prevPageWise;
    if (layoutChanged) {
      // Optional: clear any lingering old timer
      if (layoutHistoryTimer) {
        clearTimeout(layoutHistoryTimer);
        layoutHistoryTimer = null;
      }
    }

    if (prevHistory !== nextHistory) {
      store.dispatch(saving());

      layoutHistoryTimer = setTimeout(() => {
        saveToLocalStorage(store.getState().editor);
        store.dispatch(saved());
        layoutHistoryTimer = null;
      }, 2000); // short debounce after history is in
    }

    return result;
  };
