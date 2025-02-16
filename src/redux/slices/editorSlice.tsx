import {
  canElementHaveChild,
  deleteFromLayout,
  findElementById,
  handleDragLeaveInner,
  handleDropInner,
  insertElement,
  isInChildren,
  moveElementInner,
  setActiveInner,
  setAddLocationInner,
  setDropHandledInner,
} from "@/utils/EditorHelpers";
import {
  getDefaultElementProps,
  getDefaultStyle,
  getPageWise,
  saveToLocalStorage,
} from "@/utils/Helpers";
import {
  AddLocation,
  EditorState,
  ItemAndLocation,
  Layout,
  LayoutOrUnd,
  Variable,
  VariableWithId,
} from "@/utils/Types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

let initialLayout = [
  {
    id: uuidv4(),
    type: "container",
    props: {
      style: getDefaultStyle("container"),
      child: [
        {
          id: uuidv4(),
          type: "row",
          props: getDefaultElementProps("row"),
        },
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
          type: "audio",
          props: getDefaultElementProps("audio"),
        },
        {
          id: uuidv4(),
          type: "video",
          props: getDefaultElementProps("video"),
        },
      ],
    },
  },
];

const initialState: EditorState = {
  layout: initialLayout,
  addLocation: null,
  dropHandled: false,
  pageWise: getPageWise(),
  variables: [],
};

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setActive: (state, action: PayloadAction<LayoutOrUnd>) => {
      setActiveInner(state, action.payload);
    },
    hydrate: (state, action: PayloadAction<EditorState>) => {
      state.layout = action.payload.layout;
      state.pageWise = action.payload.pageWise;
      state.variables = action.payload.variables;
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
        saveToLocalStorage(state);
      }
    },
    deleteElement: (state, action: PayloadAction<string>) => {
      if (state.active) {
        const found = findElementById(state.layout, state.active.id)?.props
          .child;
        if (
          found &&
          (action.payload === state.active.id ||
            isInChildren(found, action.payload))
        ) {
          //if deleted element is active or deleted elements descendant is active
          state.active = undefined;
        }
      }
      state.layout = deleteFromLayout(state.layout, action.payload);
      saveToLocalStorage(state);
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
      } else {
        state.layout = updateStyle(state.layout);
      }
      saveToLocalStorage(state);
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
      } else {
        state.layout = removeStyle(state.layout);
      }
      saveToLocalStorage(state);
    },
    changeElementProp: (
      state,
      action: PayloadAction<{
        type: string;
        newValue: number | string | boolean;
      }>
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
      saveToLocalStorage(state); // Persist the updated layout
    },
    updateText: (state, action: PayloadAction<string>) => {
      const activeId = state.active?.id;
      if (!activeId) {
        toast.error("Active id not found");
        return;
      }
      const element = findElementById(state.layout, activeId);
      if (!element) {
        toast.error("Element not found");
        return;
      }
      element.props.text = action.payload;
      saveToLocalStorage(state);
    },
    addVariable: (state, action: PayloadAction<Variable>) => {
      const newVariable = { id: uuidv4(), ...action.payload };
      state.variables.push(newVariable);
      saveToLocalStorage(state);
    },
    editVariable: (state, action: PayloadAction<VariableWithId>) => {
      const newVariable = action.payload;
      const found = state.variables.find((item) => item.id === newVariable.id);
      if (!found) {
        toast.error("Something went wrong");
        return;
      }
      state.variables = state.variables.map((item) => {
        if (item.id === newVariable.id) {
          return newVariable;
        } else return item;
      });
      saveToLocalStorage(state);
    },
    deleteVariable: (state, action: PayloadAction<VariableWithId>) => {
      const variableToDel = action.payload;
      const found = state.variables.find(
        (item) => item.id === variableToDel.id
      );
      if (!found) {
        toast.error("Something went wrong");
        return;
      }
      state.variables = state.variables.filter(
        (item) => item.id !== variableToDel.id
      );
      saveToLocalStorage(state);
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
  updateText,
  addVariable,
  editVariable,
  deleteVariable,
} = editorSlice.actions;
export default editorSlice.reducer;
