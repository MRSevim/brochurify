import { getDefaultElementProps } from "@/utils/Helpers";
import { Layout } from "@/utils/Types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

let localStorageLayout =
  typeof window !== "undefined" ? localStorage.getItem("layout") : null;

let initialLayout = localStorageLayout
  ? JSON.parse(localStorage.getItem("layout") as string)
  : [
      {
        id: uuidv4(),
        type: "button",
        props: getDefaultElementProps("button"),
      },
      {
        id: uuidv4(),
        type: "text",
        props: getDefaultElementProps("text"),
      },
      {
        id: uuidv4(),
        type: "row",
        props: getDefaultElementProps("row"),
      },
    ];

const initialState: EditorState = {
  layout: initialLayout,
};
interface EditorState {
  active?: string;
  layout?: Layout[];
}

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setActive: (state, action: PayloadAction<string | undefined>) => {
      state.active = action.payload;
    },
    addElement: (state, action: PayloadAction<string>) => {
      if (state.layout) {
        state.layout = [
          ...state.layout,
          {
            id: uuidv4(),
            type: action.payload,
            props: getDefaultElementProps(action.payload),
          },
        ];
      }
      localStorage.setItem("layout", JSON.stringify(state.layout));
    },
    deleteElement: (state, action: PayloadAction<string>) => {
      if (state.layout) {
        state.layout = state.layout.filter(
          (item) => item.id !== action.payload
        );
      }
      localStorage.setItem("layout", JSON.stringify(state.layout));
    },
  },
});

export const { setActive, addElement, deleteElement } = editorSlice.actions;
export default editorSlice.reducer;
