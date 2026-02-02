import { configureStore } from "@reduxjs/toolkit";
import editorSlice from "../../features/builder/lib/redux/slices/editorSlice";
import { saveToHistoryMiddleware } from "../../features/builder/lib/redux/middlewares/saveToHistoryMiddleware";
import { saveToLocalOrDb } from "../../features/builder/lib/redux/middlewares/saveToLocalOrDb";
import { rowResizeMiddleware } from "../../features/builder/lib/redux/middlewares/rowResizeMiddleware";
import popupSlice from "../../features/builder/lib/redux/slices/popupSlice";
import replaySlice from "../../features/builder/lib/redux/slices/replaySlice";

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
        rowResizeMiddleware,
      ),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
