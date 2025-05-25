import {
  adjustRowChildrenWidths,
  canElementHaveChild,
  deepClone,
  deleteFromLayout,
  findElementById,
  generateNewIds,
  handleDropInner,
  insertElement,
  isInChildren,
  moveElementInner,
  moveToNextOrPreviousInner,
  removeHistoryCurrents,
  setActiveInner,
  setAddLocationInner,
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
  StringOrUnd,
  Style,
  Variable,
} from "@/utils/Types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { initialSimpleLayout } from "@/utils/InitialLayout";

const initialState: EditorState = {
  id: undefined,
  layout: initialSimpleLayout,
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
      state.id = action.payload.id;
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
    handleDrop: (
      state,
      action: PayloadAction<{ targetId: StringOrUnd; addLocation: AddLocation }>
    ) => {
      handleDropInner(
        state,
        action.payload.targetId,
        action.payload.addLocation
      );
    },
    addElement: (
      state,
      action: PayloadAction<{ type: string; addLocation: AddLocation }>
    ) => {
      const newElement = generateLayoutItem(action.payload.type);
      const active = state.active;
      const passed = canElementHaveChild(
        state,
        action.payload.addLocation,
        newElement,
        active
      );
      if (passed) {
        state.layout = insertElement(
          state,
          state.layout,
          newElement,
          action.payload.addLocation,
          active?.id,
          true
        );
        adjustRowChildrenWidths(state.layout);
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
      adjustRowChildrenWidths(state.layout);
    },
    moveElement: (state, action: PayloadAction<ItemAndLocation>) => {
      moveElementInner(state, action.payload);
    },
    changeElementStyle: (
      state,
      action: PayloadAction<{ types: (string | undefined)[]; newValue: string }>
    ) => {
      const { types, newValue } = action.payload;

      const applyStyle = <T extends Style | PageWise>(style: T): T => {
        const updatedStyle = { ...style };
        let current: any = updatedStyle;

        const path = types.filter((k): k is string => k !== undefined);

        // Traverse all keys except the last one
        for (let i = 0; i < path.length - 1; i++) {
          const key = path[i];
          if (!current[key] || typeof current[key] !== "object") {
            current[key] = {};
          }
          current = current[key];
        }

        const lastKey = path[path.length - 1];

        if (newValue) {
          current[lastKey] = newValue;
        } else {
          delete current[lastKey];
        }

        // Recursive cleanup of empty objects
        const cleanup = (obj: any): any => {
          Object.keys(obj).forEach((key) => {
            if (typeof obj[key] === "object") {
              obj[key] = cleanup(obj[key]);
              if (Object.keys(obj[key]).length === 0) {
                delete obj[key];
              }
            }
          });
          return obj;
        };

        return cleanup(updatedStyle);
      };

      const updateLayout = (layout: Layout[]): Layout[] => {
        return layout.map((item) => {
          if (item.id === state.active?.id) {
            return {
              ...item,
              props: {
                ...item.props,
                style: applyStyle(item.props.style),
              },
            };
          }

          if (Array.isArray(item.props.child)) {
            return {
              ...item,
              props: {
                ...item.props,
                child: updateLayout(item.props.child),
              },
            };
          }

          return item;
        });
      };

      if (!state.active) {
        state.pageWise = applyStyle(state.pageWise);
      } else {
        state.layout = updateLayout(state.layout);
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
    editVariable: (state, action: PayloadAction<Variable>) => {
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
    deleteVariable: (state, action: PayloadAction<Variable>) => {
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
          layout: deepClone(action.payload.layout),
          pageWise: deepClone(action.payload.pageWise),
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
      const hovered = findElementById(state.layout, state.hovered || "");
      const addLocation = state.addLocation;
      const passed = canElementHaveChild(
        state,
        addLocation,
        newElement,
        hovered
      );

      if (passed) {
        state.layout = insertElement(
          state,
          state.layout,
          newElement,
          addLocation,
          hovered?.id,
          false
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
      adjustRowChildrenWidths(state.layout);
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
  handleDrop,
  setDraggedItem,
  changeElementStyle,
  changeElementProp,
  addVariable,
  editVariable,
  deleteVariable,
  undo,
  redo,
  addToHistory,
  setCopied,
  paste,
  resetToInitial,
  setHovered,
  moveToNextOrPrevious,
  duplicate,
} = editorSlice.actions;

export default editorSlice.reducer;
