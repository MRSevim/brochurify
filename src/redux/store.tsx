import { configureStore } from "@reduxjs/toolkit";
import editorSlice from "./slices/editorSlice";
import { saveToHistoryMiddleware } from "./middlewares/saveToHistoryMiddleware";
import { saveToLocalOrDb } from "./middlewares/saveToLocalOrDb";
import { rowResizeMiddleware } from "./middlewares/rowResizeMiddleware";
import popupSlice from "./slices/popupSlice";
import replaySlice from "./slices/replaySlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      editor: editorSlice,
      popup: popupSlice,
      replay: replaySlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(
        saveToHistoryMiddleware,
        saveToLocalOrDb,
        rowResizeMiddleware
      ),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
