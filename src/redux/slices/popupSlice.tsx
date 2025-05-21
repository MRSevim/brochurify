import { SavePopup } from "@/utils/Types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: { savePopup: SavePopup } = { savePopup: null };

export const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    saving: (state) => {
      state.savePopup = "saving";
    },
    saved: (state) => {
      state.savePopup = "saved";
    },
  },
});
export const { saving, saved } = popupSlice.actions;

export default popupSlice.reducer;
