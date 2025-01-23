import {
  canElementHaveChild,
  deleteFromLayout,
  handleDragLeaveInner,
  handleDropInner,
  insertElement,
  moveElementInner,
  setActiveInner,
  setAddLocationInner,
  setDropHandledInner,
} from "@/utils/EditorHelpers";
import { getDefaultElementProps, saveToLocalStorage } from "@/utils/Helpers";
import {
  AddLocation,
  EditorState,
  ItemAndLocation,
  Layout,
  LayoutOrUnd,
} from "@/utils/Types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

let initialLayout = [
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
  addLocation: null,
  dropHandled: false,
};

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setActive: (state, action: PayloadAction<LayoutOrUnd>) => {
      setActiveInner(state, action.payload);
    },
    hydrate: (state, action) => {
      return action.payload;
    },
    setDraggedItem: (state, action: PayloadAction<string | undefined>) => {
      state.draggedItem = action.payload;
    },
    setAddLocation: (state, action: PayloadAction<AddLocation>) => {
      setAddLocationInner(state, action.payload);
    },
    setDropHandled: (state, action: PayloadAction<boolean>) => {
      setDropHandledInner(state, action.payload);
    },
    handleSideDrop: (state, action: PayloadAction<string>) => {
      handleDropInner(state, action.payload, state.addLocation);
    },
    handleCenterDrop: (state, action: PayloadAction<string>) => {
      handleDropInner(state, action.payload, null);
    },
    handleDragLeave: (state) => {
      handleDragLeaveInner(state);
    },
    handleSideDragOver: (
      state,
      action: PayloadAction<{
        addLocation: AddLocation;
      }>
    ) => {
      setAddLocationInner(state, action.payload.addLocation);
    },
    handleCenterDragOver: (state, action: PayloadAction<LayoutOrUnd>) => {
      setActiveInner(state, action.payload);
    },
    addElement: (
      state,
      action: PayloadAction<{ type: string; addLocation: AddLocation }>
    ) => {
      const newElement = {
        id: uuidv4(),
        type: action.payload.type,
        props: getDefaultElementProps(action.payload.type),
      };

      const passed = canElementHaveChild(
        state,
        action.payload.addLocation,
        newElement
      );
      if (passed) {
        state.layout = insertElement(
          state,
          state.layout,
          newElement,
          action.payload.addLocation,
          true
        );
        saveToLocalStorage(state.layout);
      }
    },
    deleteElement: (state, action: PayloadAction<string>) => {
      state.layout = deleteFromLayout(state.layout, action.payload);
      saveToLocalStorage(state.layout);
    },
    moveElement: (state, action: PayloadAction<ItemAndLocation>) => {
      moveElementInner(state, action.payload);
    },
    changeElementStyle: (
      state,
      action: PayloadAction<{ type: string; newValue: string }>
    ) => {
      const { type, newValue } = action.payload;

      const updateStyle = (layout: Layout[]): Layout[] => {
        return layout.map((item) => {
          if (item.id === state.active?.id) {
            return {
              ...item,
              props: {
                ...item.props,
                style: {
                  ...item.props.style,
                  [type]: newValue,
                },
              },
            };
          }

          if (item.props.child && Array.isArray(item.props.child)) {
            return {
              ...item,
              props: {
                ...item.props,
                child: updateStyle(item.props.child),
              },
            };
          }

          return item;
        });
      };

      state.layout = updateStyle(state.layout);
      saveToLocalStorage(state.layout);
    },
  },
});

export const {
  setActive,
  addElement,
  deleteElement,
  hydrate,
  moveElement,
  setAddLocation,
  setDropHandled,
  handleDragLeave,
  handleSideDragOver,
  handleSideDrop,
  handleCenterDrop,
  handleCenterDragOver,
  setDraggedItem,
  changeElementStyle,
} = editorSlice.actions;
export default editorSlice.reducer;
