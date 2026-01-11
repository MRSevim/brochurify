import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "../../../../../lib/redux/store";
import {
  changeElementProp,
  changeElementStyle,
  hydrate,
  redo,
  undo,
  addToHistory,
  hydrateLocal,
} from "../slices/editorSlice";

let debounceTimer: NodeJS.Timeout | null = null; // Timer for debounce

export const saveToHistoryMiddleware: Middleware =
  (store) => (next) => (action) => {
    // Ignore certain actions
    const isUndoOrRedo = undo.match(action) || redo.match(action);
    if (isUndoOrRedo || hydrate.match(action) || hydrateLocal.match(action)) {
      return next(action);
    }

    const prevState = store.getState() as RootState;
    const prevLayout = JSON.stringify(prevState.editor.layout);
    const prevPageWise = JSON.stringify(prevState.editor.pageWise);

    const result = next(action);

    const nextState = store.getState() as RootState;

    const propOrStyleChange =
      changeElementProp.match(action) || changeElementStyle.match(action);

    if (
      JSON.stringify(nextState.editor.layout) !== prevLayout ||
      JSON.stringify(nextState.editor.pageWise) !== prevPageWise
    ) {
      const save = () => {
        store.dispatch(
          addToHistory({
            layout: nextState.editor.layout,
            pageWise: nextState.editor.pageWise,
          })
        );
      };
      if (propOrStyleChange) {
        // Clear previous debounce timer if exists
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }
        // Set a new debounce timer
        debounceTimer = setTimeout(() => {
          save();
          debounceTimer = null; // Reset timer
        }, 1000);
      } else {
        // Always save to history otherwise
        save();
      }
    }

    return result;
  };
