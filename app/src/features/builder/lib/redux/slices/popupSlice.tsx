import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: { savePopup: string } = { savePopup: "" };

export const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    saving: (state) => {
      state.savePopup = "Saving...";
    },
    saved: (state, action: PayloadAction<string | undefined>) => {
      state.savePopup = "Saved" + (action.payload || "") + "!";
    },
  },
});
export const { saving, saved } = popupSlice.actions;

export default popupSlice.reducer;
