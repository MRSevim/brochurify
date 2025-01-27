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
import {
  getDefaultElementProps,
  getDefaultStyle,
  saveToLocalStorage,
} from "@/utils/Helpers";
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
    type: "image",
    props: getDefaultElementProps("image"),
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
  pageWise: getDefaultStyle("pageWise"),
};

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setActive: (state, action: PayloadAction<LayoutOrUnd>) => {
      setActiveInner(state, action.payload);
    },
    hydrate: (state, action) => {
      state.layout = action.payload.layout;
      state.pageWise = action.payload.pageWise || getDefaultStyle("pageWise");
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
        saveToLocalStorage("layout", state.layout);
      }
    },
    deleteElement: (state, action: PayloadAction<string>) => {
      state.layout = deleteFromLayout(state.layout, action.payload);
      saveToLocalStorage("layout", state.layout);
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
      if (!state.active) {
        state.pageWise[type] = newValue;
        saveToLocalStorage("pageWise", state.pageWise);
      } else {
        state.layout = updateStyle(state.layout);
        saveToLocalStorage("layout", state.layout);
      }
    },
    removeElementStyle: (state, action: PayloadAction<{ type: string }>) => {
      const { type } = action.payload;

      const removeStyle = (layout: Layout[]): Layout[] => {
        return layout.map((item) => {
          // Check if the current item has the active ID
          if (item.id === state.active?.id) {
            // Remove the style property if it exists
            const { [type]: _, ...updatedStyle } = item.props.style || {};
            return {
              ...item,
              props: {
                ...item.props,
                style: updatedStyle,
              },
            };
          }

          // If the item has child elements, apply recursion
          if (item.props.child && Array.isArray(item.props.child)) {
            return {
              ...item,
              props: {
                ...item.props,
                child: removeStyle(item.props.child),
              },
            };
          }

          return item; // Return the item unchanged if no updates are needed
        });
      };
      if (!state.active) {
        state.pageWise[type] = undefined;
        saveToLocalStorage("pageWise", state.pageWise);
      } else {
        state.layout = removeStyle(state.layout); // Update the state layout with the modified structure
        saveToLocalStorage("layout", state.layout); // Persist the updated layout
      }
    },
    changeElementProp: (
      state,
      action: PayloadAction<{ type: string; newValue: number }>
    ) => {
      const { type, newValue } = action.payload;

      const changeProp = (layout: Layout[]): Layout[] => {
        return layout.map((item) => {
          // Check if the current item has the active ID
          if (item.id === state.active?.id) {
            return {
              ...item,
              props: {
                ...item.props,
                [type]: newValue,
              },
            };
          }

          // If the item has child elements, apply recursion
          if (item.props.child && Array.isArray(item.props.child)) {
            return {
              ...item,
              props: {
                ...item.props,
                child: changeProp(item.props.child),
              },
            };
          }

          return item; // Return the item unchanged if no updates are needed
        });
      };

      state.layout = changeProp(state.layout); // Update the state layout with the modified structure
      saveToLocalStorage("layout", state.layout); // Persist the updated layout
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
  removeElementStyle,
  changeElementProp,
} = editorSlice.actions;
export default editorSlice.reducer;
