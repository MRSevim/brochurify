import {
  canElementHaveChild,
  deleteFromLayout,
  findElementById,
  generateNewIds,
  handleDragLeaveInner,
  handleDropInner,
  insertElement,
  isInChildren,
  moveElementInner,
  moveToNextOrPreviousInner,
  removeHistoryCurrents,
  setActiveInner,
  setAddLocationInner,
  setDropHandledInner,
} from "@/utils/EditorHelpers";
import { generateLayoutItem, getPageWise } from "@/utils/Helpers";
import {
  AddLocation,
  EditorState,
  ItemAndLocation,
  Layout,
  LayoutOrUnd,
  MoveTo,
  PageWise,
  Style,
  Variable,
  VariableWithId,
} from "@/utils/Types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { initialLayout as initialLayoutFromFile } from "@/utils/InitialLayout";

let initialLayout = initialLayoutFromFile;

const initialState: EditorState = {
  layout: initialLayout,
  addLocation: null,
  dropHandled: false,
  pageWise: getPageWise(),
  variables: [],
  history: [],
};

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    resetToInitial: () => {
      return initialState;
    },
    setActive: (state, action: PayloadAction<LayoutOrUnd>) => {
      setActiveInner(state, action.payload);
    },
    setHovered: (state, action: PayloadAction<string | undefined>) => {
      state.hovered = action.payload;
    },
    hydrate: (state, action: PayloadAction<EditorState>) => {
      state.layout = action.payload.layout;
      state.pageWise = action.payload.pageWise;
      state.variables = action.payload.variables;
      state.history = action.payload.history;
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
      const newElement = generateLayoutItem(action.payload.type);
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
      }
    },
    deleteElement: (state, action: PayloadAction<string>) => {
      if (state.active) {
        const found = findElementById(state.layout, state.active.id);
        if (
          found &&
          (action.payload === state.active.id ||
            isInChildren(found.props.child, action.payload))
        ) {
          //if deleted element is active or deleted elements descendant is active
          state.active = undefined;
        }
      }
      state.layout = deleteFromLayout(state.layout, action.payload);
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
    },
    changeInnerElementStyle: (
      state,
      action: PayloadAction<{
        outerType: string;
        innerType: string;
        newValue: string;
      }>
    ) => {
      const { outerType, innerType, newValue } = action.payload;
      const updateStyle = (layout: Layout[]): Layout[] => {
        return layout.map((item) => {
          if (item.id === state.active?.id) {
            // Clone existing styles
            const updatedStyle = { ...item.props.style };
            const outerStyle = { ...(updatedStyle[outerType] as Style) };

            if (newValue) {
              // Update the innerType value
              outerStyle[innerType] = newValue;
            } else {
              // Remove innerType if newValue is falsy
              delete outerStyle[innerType];
            }

            // Remove outerType if it's now empty
            if (Object.keys(outerStyle).length === 0) {
              delete updatedStyle[outerType];
            } else {
              updatedStyle[outerType] = outerStyle;
            }

            return {
              ...item,
              props: {
                ...item.props,
                style: updatedStyle,
              },
            };
          }

          // Recursively update children
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
        const updatedStyle = { ...state.pageWise };
        const outerStyle = {
          ...(state.pageWise[outerType] as Style),
        };

        if (newValue) {
          // Update the innerType value
          outerStyle[innerType] = newValue;
        } else {
          // Remove innerType if newValue is falsy
          delete outerStyle[innerType];
        }

        // Remove outerType if it's now empty
        if (Object.keys(outerStyle).length === 0) {
          delete updatedStyle[outerType];
        } else {
          updatedStyle[outerType] = outerStyle;
        }
        state.pageWise = updatedStyle;
      } else {
        state.layout = updateStyle(state.layout);
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
      } else {
        state.layout = removeStyle(state.layout);
      }
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
    },
    addVariable: (state, action: PayloadAction<Variable>) => {
      const newVariable = { id: uuidv4(), ...action.payload };
      state.variables.push(newVariable);
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
    },
    undo: (state) => {
      const history = state.history;

      if (history.length === 0) {
        toast.error("No history recorded");
        return;
      }
      if (history[0].current) {
        toast.error("You are on the first history item");
      } else {
        const foundIndex = history.findIndex((item) => item.current);
        if (foundIndex === -1) {
          toast.error("Something went wrong");
        } else {
          removeHistoryCurrents(state);
          const oneBefore = foundIndex - 1;
          history[oneBefore].current = true;
          state.layout = history[oneBefore].structure.layout;
          state.pageWise = history[oneBefore].structure.pageWise;
        }
      }
    },
    redo: (state) => {
      const history = state.history;
      const historyLength = state.history.length;
      if (historyLength === 0) {
        toast.error("No history recorded");
        return;
      }
      if (history[historyLength - 1].current) {
        toast.error("You are on the last history item");
      } else {
        const foundIndex = history.findIndex((item) => item.current);
        if (foundIndex === -1) {
          toast.error("Something went wrong");
        } else {
          removeHistoryCurrents(state);
          const oneAfter = foundIndex + 1;
          history[oneAfter].current = true;
          state.layout = history[oneAfter].structure.layout;
          state.pageWise = history[oneAfter].structure.pageWise;
        }
      }
    },
    addToHistory: (
      state,
      action: PayloadAction<{ layout: Layout[]; pageWise: PageWise }>
    ) => {
      removeHistoryCurrents(state);
      state.history.push({
        current: true,
        structure: {
          layout: action.payload.layout,
          pageWise: action.payload.pageWise,
        },
      });
    },
    setCopied: (state, action: PayloadAction<Layout>) => {
      state.copied = action.payload;
      toast.success("Copied hovered element");
    },
    paste: (state) => {
      if (!state.copied) {
        toast.error("You have not copied anything");
        return;
      }
      const newElement = generateNewIds(state.copied);
      const addLocation = state.addLocation;
      const passed = canElementHaveChild(state, addLocation, newElement);

      if (passed) {
        state.layout = insertElement(
          state,
          state.layout,
          newElement,
          addLocation,
          true
        );
      }
    },
    moveToNextOrPrevious: (state, action: PayloadAction<MoveTo>) => {
      const currentElement = action.payload.item;

      if (!currentElement) {
        toast.error("Something went wrong");
        return;
      }
      state.layout = moveToNextOrPreviousInner(state, action.payload);
    },
    duplicate: (state, action: PayloadAction<Layout>) => {
      const targetId = action.payload.id;

      const insertDuplicate = (layout: Layout[]): boolean => {
        for (let i = 0; i < layout.length; i++) {
          const item = layout[i];

          if (item.id === targetId) {
            const duplicated = generateNewIds(item); // your function for deep ID regeneration
            layout.splice(i + 1, 0, duplicated); // insert right after
            return true;
          }

          if (Array.isArray(item.props.child)) {
            const inserted = insertDuplicate(item.props.child);
            if (inserted) return true;
          }
        }

        return false;
      };

      insertDuplicate(state.layout);
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
  addVariable,
  editVariable,
  deleteVariable,
  undo,
  redo,
  addToHistory,
  setCopied,
  paste,
  changeInnerElementStyle,
  resetToInitial,
  setHovered,
  moveToNextOrPrevious,
  duplicate,
} = editorSlice.actions;

export default editorSlice.reducer;
