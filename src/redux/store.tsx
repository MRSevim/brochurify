import { configureStore } from "@reduxjs/toolkit";
import editorSlice from "./slices/editorSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      editor: editorSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
