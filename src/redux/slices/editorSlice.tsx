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
};

export const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setActive: (state, action: PayloadAction<string | undefined>) => {
      state.active = action.payload;
    },
    hydrate: (state, action) => {
      return action.payload;
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
      if (state.layout) {
        if (action.payload.addLocation?.id === action.payload.id) return;
        const currentElement = findElementById(state.layout, action.payload.id);

        if (!currentElement) return; // If the element wasn't found, do nothing
        const passed = canElementHaveChild(state, action.payload.addLocation);
        if (passed) {
          if (
            (state.active &&
              isInChildren(currentElement.props.child, state.active)) ||
            (action.payload.addLocation?.id &&
              isInChildren(
                currentElement.props.child,
                action.payload.addLocation.id
              ))
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
            action.payload.addLocation,
            false
          );

          saveCookie(state.layout);
        }
      }
    },
  },
});

export const { setActive, addElement, deleteElement, hydrate, moveElement } =
  editorSlice.actions;
export default editorSlice.reducer;

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
