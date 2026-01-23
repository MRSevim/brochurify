import {
  canElementHaveChild,
  deepClone,
  deleteFromLayout,
  findElementById,
  generateNewIds,
  insertElement,
  isInChildren,
  moveElementInner,
  removeHistoryCurrents,
} from "@/features/builder/utils/EditorHelpers";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import {
  EditorState,
  OverType,
  AddLocation,
  PageWise,
  Style,
  Variable,
} from "@/features/builder/utils/types/types.d";
import { StringOrUnd } from "@/utils/types/Types.d";
import {
  generateLayoutItem,
  getPageWise,
} from "@/features/builder/utils/helpers";
import { Layout } from "@/features/builder/utils/types/propTypes.d";

const initialState: EditorState = {
  type: "project",
  id: undefined,
  layout: [],
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
    setActive: (state, action: PayloadAction<string | undefined>) => {
      state.addLocation = null;
      state.active = action.payload;
    },
    setHovered: (state, action: PayloadAction<OverType | undefined>) => {
      state.hovered = action.payload;
    },
    setDraggedOver: (state, action: PayloadAction<OverType | undefined>) => {
      state.draggedOver = action.payload;
    },
    setPublished: (state, action: PayloadAction<boolean>) => {
      state.published = action.payload;
    },
    setCustomDomain: (state, action: PayloadAction<string>) => {
      state.customDomain = action.payload;
    },
    setPrefix: (state, action: PayloadAction<string>) => {
      state.prefix = action.payload;
    },
    setDomainVerified: (state, action: PayloadAction<boolean | undefined>) => {
      state.domainVerified = action.payload;
    },
    updateLayout: (state, action: PayloadAction<Layout[]>) => {
      state.layout = action.payload;
    },
    hydrate: (state, action: PayloadAction<EditorState>) => {
      const layout = action.payload.layout;
      const pageWise = action.payload.pageWise;
      state.id = action.payload.id;
      state.layout = layout;
      state.pageWise = pageWise;
      state.variables = action.payload.variables;
      state.type = action.payload.type;
      state.history = [{ current: true, structure: { layout, pageWise } }];
      state.domainVerified = action.payload.domainVerified;
      state.published = action.payload.published;
      state.customDomain = action.payload.customDomain;
      state.prefix = action.payload.prefix;
    },
    hydrateLocal: (state, action: PayloadAction<EditorState>) => {
      const layout = action.payload.layout;
      const pageWise = action.payload.pageWise;
      state.layout = layout;
      state.pageWise = pageWise;
      state.variables = action.payload.variables;
      state.history = [{ current: true, structure: { layout, pageWise } }];
    },
    setFromLocal: (state, action: PayloadAction<EditorState>) => {
      state.layout = action.payload.layout;
      state.pageWise = action.payload.pageWise;
      state.variables = action.payload.variables;
    },
    setDraggedItem: (state, action: PayloadAction<string | undefined>) => {
      state.draggedItem = action.payload;
    },
    setAddLocation: (state, action: PayloadAction<AddLocation>) => {
      state.active = undefined;
      state.addLocation = action.payload;
    },
    handleDrop: (
      state,
      action: PayloadAction<{
        targetId: StringOrUnd;
        addLocation: AddLocation;
      }>,
    ) => {
      const addLocation = action.payload.addLocation;
      const targetId = action.payload.targetId;
      const id = state.draggedItem;
      const item = findElementById(state.layout, id || "");
      if (id === targetId) return;
      moveElementInner(state, { item, targetId, addLocation });
      state.draggedItem = undefined;
    },
    addElement: (
      state,
      action: PayloadAction<{ type: string; addLocation: AddLocation }>,
    ) => {
      const newElement = generateLayoutItem(action.payload.type);
      const active = findElementById(state.layout, state.active);
      const passed = canElementHaveChild(
        state,
        action.payload.addLocation,
        newElement,
        active,
      );
      if (passed) {
        insertElement(
          state.layout,
          newElement,
          action.payload.addLocation,
          active?.id,
          true,
        );
      }
    },
    deleteElement: (state, action: PayloadAction<string>) => {
      if (state.active) {
        const found = findElementById(state.layout, state.active);
        if (
          found &&
          (action.payload === state.active ||
            isInChildren(found.props.child, action.payload))
        ) {
          //if deleted element is active or deleted element is descendant is active
          state.active = undefined;
        }
      }
      deleteFromLayout(state.layout, action.payload);
    },
    changeElementStyle: (
      state,
      action: PayloadAction<{
        types: (string | undefined)[];
        newValue: string;
      }>,
    ) => {
      const { types, newValue } = action.payload;

      const applyStyle = <T extends Style | PageWise>(style: T) => {
        let current: Record<string, any> = style;
        const path = types.filter((k): k is string => k !== undefined);

        if (path.length === 0) return;

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
        const cleanup = (obj: any) => {
          if (typeof obj !== "object" || obj === null) return;

          for (const key of Object.keys(obj)) {
            cleanup(obj[key]);
            if (
              typeof obj[key] === "object" &&
              Object.keys(obj[key]).length === 0
            ) {
              delete obj[key];
            }
          }
        };

        return cleanup(style);
      };

      if (!state.active) {
        applyStyle(state.pageWise);
      } else {
        // Walk through layout to find active item and mutate its style
        const updateLayout = (layout: Layout[]) => {
          for (const item of layout) {
            if (item.id === state.active) {
              if (!item.props.style) item.props.style = {};
              applyStyle(item.props.style);

              return true; // found and updated
            }

            if ("child" in item.props && Array.isArray(item.props.child)) {
              const found = updateLayout(item.props.child as Layout[]);
              if (found) return true;
            }
          }
          return false;
        };

        updateLayout(state.layout);
      }
    },
    changeElementProp: (
      state,
      action: PayloadAction<{
        type: string;
        newValue: number | string | boolean;
      }>,
    ) => {
      const { type, newValue } = action.payload;

      const changeProp = (layout: Layout[]): boolean => {
        let changed = false;

        for (const item of layout) {
          if (item.id === state.active) {
            // Directly mutate the prop on the draft
            item.props[type] = newValue;
            changed = true;
          }

          if ("child" in item.props && Array.isArray(item.props.child)) {
            const childChanged = changeProp(item.props.child);
            if (childChanged) changed = true;
          }
        }

        return changed;
      };

      changeProp(state.layout);
    },
    addVariable: (state, action: PayloadAction<Variable>) => {
      const newVariable = { id: uuidv4(), ...action.payload };
      state.variables.push(newVariable);
    },
    editVariable: (state, action: PayloadAction<Variable>) => {
      const newVariable = action.payload;
      const foundIndex = state.variables.findIndex(
        (item) => item.id === newVariable.id,
      );

      if (foundIndex === -1) {
        toast.error("Something went wrong");
        return;
      }

      // Directly mutate the variable object in the draft array
      state.variables[foundIndex] = newVariable;
    },
    deleteVariable: (state, action: PayloadAction<Variable>) => {
      const variableToDel = action.payload;
      const index = state.variables.findIndex(
        (item) => item.id === variableToDel.id,
      );
      if (index === -1) {
        toast.error("Something went wrong");
        return;
      }
      state.variables.splice(index, 1);
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
      action: PayloadAction<{ layout: Layout[]; pageWise: PageWise }>,
    ) => {
      const history = state.history;
      const currentIndex = history.findIndex((item) => item.current);

      // If current is not at the end, remove all history after current
      if (currentIndex !== -1 && currentIndex < history.length - 1) {
        history.splice(currentIndex + 1);
      }
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
        return;
      }
      const newElement = generateNewIds(state.copied);
      const hovered = findElementById(state.layout, state.hovered?.id || "");
      const addLocation = state.addLocation;
      const passed = canElementHaveChild(
        state,
        addLocation,
        newElement,
        hovered,
      );

      if (passed) {
        insertElement(
          state.layout,
          newElement,
          addLocation,
          hovered?.id,
          false,
        );
      }
    },
    moveToNextOrPrevious: (
      state,
      action: PayloadAction<{ id: string; location: "previous" | "next" }>,
    ) => {
      const currentElementId = action.payload.id;

      if (!currentElementId) {
        toast.error("Something went wrong");
        return;
      }

      const location = action.payload.location;

      const moveInArray = (arr: Layout[]): boolean => {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id === currentElementId) {
            if (location === "previous") {
              if (i === 0) {
                // Can't move, already first
                toast.error(
                  "This element is the first element in its parent and can't be moved further",
                );
                return false;
              }
              [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
            } else if (location === "next") {
              if (i === arr.length - 1) {
                // Can't move, already last
                toast.error(
                  "This element is the last element in its parent and can't be moved further",
                );
                return false;
              }
              [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
            }
            return true; // Move complete
          }

          if (Array.isArray(arr[i].props.child)) {
            const moved = moveInArray(arr[i].props.child!);
            if (moved) return true;
          }
        }
        return false;
      };

      moveInArray(state.layout);
    },
    duplicate: (state, action: PayloadAction<string>) => {
      const targetId = action.payload;

      const insertDuplicate = (layout: Layout[]): boolean => {
        for (let i = 0; i < layout.length; i++) {
          const item = layout[i];

          if (item.id === targetId) {
            const duplicated = generateNewIds(item); // function for deep ID regeneration
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
  setDraggedOver,
  setDomainVerified,
  setFromLocal,
  setPrefix,
  setPublished,
  setActive,
  addElement,
  deleteElement,
  hydrate,
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
  hydrateLocal,
  updateLayout,
  setCustomDomain,
} = editorSlice.actions;

export default editorSlice.reducer;
