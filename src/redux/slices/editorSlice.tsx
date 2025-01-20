import { getDefaultElementProps, saveCookie } from "@/utils/Helpers";
import { AddLocation, EditorState, Layout } from "@/utils/Types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
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
    setActive: (state, action: PayloadAction<string | undefined>) => {
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
    handleCenterDragOver: (state, action: PayloadAction<string>) => {
      setActiveInner(state, action.payload);
    },
    addElement: (
      state,
      action: PayloadAction<{ type: string; addLocation: AddLocation }>
    ) => {
      if (state.layout) {
        const newElement = {
          id: uuidv4(),
          type: action.payload.type,
          props: getDefaultElementProps(action.payload.type),
        };

        const passed = canElementHaveChild(state, action.payload.addLocation);
        if (passed) {
          state.layout = insertElement(
            state,
            state.layout,
            newElement,
            action.payload.addLocation,
            true
          );
          saveCookie(state.layout);
        }
      }
    },
    deleteElement: (state, action: PayloadAction<string>) => {
      if (state.layout) {
        state.layout = deleteFromLayout(state.layout, action.payload);
        saveCookie(state.layout);
      }
    },
    moveElement: (
      state,
      action: PayloadAction<{ id: string; addLocation: AddLocation }>
    ) => {
      moveElementInner(state, action.payload);
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
} = editorSlice.actions;
export default editorSlice.reducer;

const setActiveInner = (state: EditorState, payload: string | undefined) => {
  state.active = payload;
};
const handleDropInner = (
  state: EditorState,
  targetId: string,
  addLocation: AddLocation
) => {
  const id = state.draggedItem;
  setDropHandledInner(state, true);
  if (id === targetId) return;
  moveElementInner(state, { id: id || "", addLocation });
  handleDragLeaveInner(state);
};
const setDropHandledInner = (state: EditorState, bool: boolean) => {
  state.dropHandled = bool;
};
const setAddLocationInner = (state: EditorState, addLocation: AddLocation) => {
  state.addLocation = addLocation;
};
const handleDragLeaveInner = (state: EditorState) => {
  state.active = undefined;
  state.addLocation = null;
};
const moveElementInner = (
  state: EditorState,
  payload: { id: string; addLocation: AddLocation }
) => {
  if (state.layout) {
    if (payload.addLocation?.id === payload.id) return;
    const currentElement = findElementById(state.layout, payload.id);

    if (!currentElement) {
      toast.error("Something went wrong");
      return;
    }
    if (!state.active && !payload.addLocation) return;
    const passed = canElementHaveChild(state, payload.addLocation);
    if (passed) {
      if (
        (state.active &&
          isInChildren(currentElement.props.child, state.active)) ||
        (payload.addLocation?.id &&
          isInChildren(currentElement.props.child, payload.addLocation.id))
      ) {
        toast.error("You cannot insert an element into its own children");
        return;
      }
      state.layout = deleteFromLayout(state.layout, currentElement.id);
      // Add the element to its new location
      state.layout = insertElement(
        state,
        state.layout,
        currentElement,
        payload.addLocation,
        false
      );

      saveCookie(state.layout);
    }
  }
};
const canElementHaveChild = (state: EditorState, addLocation: AddLocation) => {
  if (addLocation) {
    return true;
  } else {
    if (state.layout && state.active) {
      const found = findElementById(state.layout, state.active);
      if (found?.type === "column" || found?.type === "row") {
        return true;
      } else {
        toast.error("This element cannot have children");
        return false;
      }
    } else {
      return true;
    }
  }
};
// Helper function to check if the target ID is within the children of a layout element
const isInChildren = (
  children: Layout[] | undefined,
  targetId: string
): boolean => {
  if (!children) return false;
  for (const child of children) {
    if (child.id === targetId || isInChildren(child.props.child, targetId)) {
      return true; // Target ID found in children
    }
  }
  return false;
};

// Update the layout by filtering out the target element
const deleteFromLayout = (layout: Layout[], targetId: string): Layout[] => {
  return layout.reduce((result, item) => {
    if (item.id === targetId) {
      // Skip this item to delete it
      return result;
    }

    // If the item has children, apply the function recursively
    if (item.props?.child) {
      item.props.child = deleteFromLayout(item.props.child, targetId);
    }

    // Push the current item to the result
    result.push(item);
    return result;
  }, [] as Layout[]);
};

const findElementById = (
  layout: Layout[],
  targetId: string
): Layout | undefined => {
  for (const item of layout) {
    if (item.id === targetId) {
      return item; // Found the target element
    }

    // If the item has children, search recursively
    if (item.props?.child) {
      const found = findElementById(item.props.child as Layout[], targetId);
      if (found) return found; // Return if the target is found in children
    }
  }
  return undefined; // Return undefined if not found
};

const insertElement = (
  state: EditorState,
  layout: Layout[],
  newElement: Layout,
  addLocation: AddLocation,
  pushIfNoActive: boolean
) => {
  if (!addLocation) {
    // No specific location, add to the active item's child or the main layout
    if (state.active) {
      for (let i = 0; i < layout.length; i++) {
        if (layout[i].id === state.active) {
          // If the active item has no child array, initialize it
          if (!layout[i].props.child) {
            layout[i].props.child = [];
          }

          layout[i].props.child!.push(newElement); // Add to the active item's children

          return layout;
        }

        // If the current item has children, search recursively
        if (layout[i].props.child) {
          layout[i].props.child = insertElement(
            state,
            layout[i].props.child as Layout[],
            newElement,
            addLocation,
            pushIfNoActive
          );
        }
      }
    } else {
      // No active ID, add to the end of the main layout
      if (pushIfNoActive) layout.push(newElement);
    }
    return layout;
  }

  // Find the index of the item with the given ID
  for (let i = 0; i < layout.length; i++) {
    if (layout[i].id === addLocation.id) {
      if (addLocation.where === "before") {
        layout.splice(i, 0, newElement); // Insert before
      } else if (addLocation.where === "after") {
        layout.splice(i + 1, 0, newElement); // Insert after
      }
      return layout; // Stop searching once inserted
    }

    // If the current item has children, search recursively
    if (layout[i].props.child) {
      layout[i].props.child = insertElement(
        state,
        layout[i].props.child as Layout[],
        newElement,
        addLocation,
        pushIfNoActive
      );
    }
  }

  return layout;
};
