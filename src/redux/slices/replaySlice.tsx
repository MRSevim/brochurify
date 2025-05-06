import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ReplayState = { id: string; trigger: number };

const initialState: { replayArr: ReplayState[]; globalTrigger: number } = {
  replayArr: [],
  globalTrigger: 1,
};

const replaySlice = createSlice({
  name: "replay",
  initialState,
  reducers: {
    triggerReplay: (state, action: PayloadAction<string | undefined>) => {
      const id = action.payload;
      if (id) {
        const found = state.replayArr.find((item) => item.id === id);

        if (found) {
          found.trigger += 1; // Increase trigger for same id
        } else {
          state.replayArr.push({ id, trigger: 1 });
        }
      } else {
        state.globalTrigger++;
      }
    },
  },
});

export const { triggerReplay } = replaySlice.actions;
export default replaySlice.reducer;
