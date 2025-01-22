import { toast } from "react-toastify";
import {
  AddLocation,
  EditorState,
  ItemAndLocation,
  Layout,
  LayoutOrUnd,
} from "./Types";
import { saveCookie } from "./Helpers";

export const setActiveInner = (state: EditorState, payload: LayoutOrUnd) => {
  state.active = payload;
};
export const handleDropInner = (
  state: EditorState,
  targetId: string,
  addLocation: AddLocation
) => {
  const id = state.draggedItem;
  const item = findElementById(state.layout, id || "");
  setDropHandledInner(state, true);
  if (id === targetId) return;
  moveElementInner(state, { item, addLocation });
  handleDragLeaveInner(state);
};
export const setDropHandledInner = (state: EditorState, bool: boolean) => {
  state.dropHandled = bool;
};
export const setAddLocationInner = (
  state: EditorState,
  addLocation: AddLocation
) => {
  state.addLocation = addLocation;
};
export const handleDragLeaveInner = (state: EditorState) => {
  state.active = undefined;
  state.addLocation = null;
};
export const moveElementInner = (
  state: EditorState,
  payload: ItemAndLocation
) => {
  if (payload.addLocation?.id === payload.item?.id) return;
  const currentElement = payload.item;

  if (!currentElement) {
    toast.error("Something went wrong");
    return;
  }
  if (!state.active && !payload.addLocation) return;
  const passed = canElementHaveChild(
    state,
    payload.addLocation,
    currentElement
  );
  if (passed) {
    if (
      (state.active &&
        isInChildren(currentElement.props.child, state.active.id)) ||
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
};
export const canElementHaveChild = (
  state: EditorState,
  addLocation: AddLocation,
  newElement: Layout
) => {
  const parentElements = ["column", "row", "button"];

  // Helper function to check if targetId is inside a button and track parent types
  const isInsideButton = (layout: Layout[], targetId: string): boolean => {
    const findParentChain = (
      layout: Layout[],
      targetId: string
    ): string[] | null => {
      for (const element of layout) {
        if (element.id === targetId) {
          return [element.type]; // Return the current element type if it's the target
        }
        // If the element has children, recursively search and track the chain
        if (element.props.child && element.props.child.length > 0) {
          const chain = findParentChain(element.props.child, targetId);
          if (chain) {
            return [element.type, ...chain]; // Append the current type to the chain
          }
        }
      }
      return null; // Target not found
    };

    const parentChain = findParentChain(layout, targetId);
    if (parentChain && parentChain.includes("button")) {
      return true; // If "button" is found in the parent chain
    }
    return false;
  };

  if (
    newElement.type === "button" &&
    isInsideButton(state.layout, addLocation?.id || state.active?.id || "")
  ) {
    toast.error("Cannot add button inside another button");
    return false;
  }

  if (addLocation) {
    return true;
  } else {
    if (state.active) {
      const found = state.active;
      if (found && parentElements.includes(found?.type)) {
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
export const isInChildren = (
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
export const deleteFromLayout = (
  layout: Layout[],
  targetId: string
): Layout[] => {
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

export const findElementById = (
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

export const insertElement = (
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
        if (layout[i].id === state.active.id) {
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
