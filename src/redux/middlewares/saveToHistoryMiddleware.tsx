import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  changeElementProp,
  changeElementStyle,
  hydrate,
  redo,
  undo,
  addToHistory,
} from "../slices/editorSlice";

let lastSave = 0; // Timestamp for throttling

export const saveToHistoryMiddleware: Middleware =
  (store) => (next) => (action) => {
    // Ignore certain actions
    if (undo.match(action) || redo.match(action) || hydrate.match(action)) {
      return next(action);
    }
    const prevState = store.getState() as RootState;
    const prevLayout = JSON.stringify(prevState.editor.layout);
    const prevPageWise = JSON.stringify(prevState.editor.pageWise);

    const result = next(action);

    const nextState = store.getState() as RootState;
    const now = Date.now();

    const propOrStyleChange =
      changeElementProp.match(action) || changeElementStyle.match(action);

    if (
      JSON.stringify(nextState.editor.layout) !== prevLayout ||
      JSON.stringify(nextState.editor.pageWise) !== prevPageWise
    ) {
      const save = () =>
        store.dispatch(
          addToHistory({
            layout: nextState.editor.layout,
            pageWise: nextState.editor.pageWise,
          })
        );
      if (propOrStyleChange) {
        // Apply throttle only for style/prop changes
        if (now - lastSave > 200) {
          lastSave = now;
          save();
        }
      } else {
        // Always save to history otherwise
        save();
      }
    }

    return result;
  };
