import { toast } from "react-toastify";
import {
  AddLocation,
  EditorState,
  ItemAndLocation,
  Layout,
  LayoutOrUnd,
  MoveTo,
  StringOrUnd,
} from "./Types";
import { v4 as uuidv4 } from "uuid";

export const setActiveInner = (state: EditorState, payload: LayoutOrUnd) => {
  state.addLocation = null;
  state.active = payload;
};
export const handleDropInner = (
  state: EditorState,
  targetId: StringOrUnd,
  addLocation: AddLocation
) => {
  const id = state.draggedItem;
  const item = findElementById(state.layout, id || "");
  if (id === targetId) return;
  moveElementInner(state, { item, targetId, addLocation });
  state.draggedItem = undefined;
};
export const setAddLocationInner = (
  state: EditorState,
  addLocation: AddLocation
) => {
  state.active = undefined;
  state.addLocation = addLocation;
};
export const moveElementInner = (
  state: EditorState,
  payload: ItemAndLocation
) => {
  if (payload.addLocation?.id === payload.item?.id) return;
  const currentElement = payload.item;
  const targetId = payload.targetId;
  if (!currentElement) {
    toast.error("Something went wrong");
    return;
  }
  if (!targetId && !payload.addLocation) return;
  const targetElement = findElementById(state.layout, targetId || "");
  const passed = canElementHaveChild(
    state,
    payload.addLocation,
    currentElement,
    targetElement
  );
  if (passed) {
    if (
      (targetId && isInChildren(currentElement.props.child, targetId)) ||
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
      targetId,
      false
    );
  }
};
export const removeHistoryCurrents = (state: EditorState) => {
  state.history = state.history.map((item) => {
    item.current = false;
    return item;
  });
};
export const canElementHaveChild = (
  state: EditorState,
  addLocation: AddLocation,
  newElement: Layout,
  targetElement: Layout | undefined
) => {
  const parentElements = ["column", "row", "button", "container", "fixed"];

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
    isInsideButton(state.layout, addLocation?.id || targetElement?.id || "")
  ) {
    toast.error("Cannot add button inside another button");
    return false;
  }

  if (addLocation) {
    return true;
  } else {
    if (targetElement) {
      const found = targetElement;
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

export const deleteFromLayout = (
  layout: Layout[],
  targetId: string
): Layout[] => {
  let changed = false;

  const newLayout = layout.map((item) => {
    if (item.id === targetId) {
      changed = true;
      return null; // Mark for deletion
    }

    let updatedItem = item;

    if (item.props?.child && Array.isArray(item.props.child)) {
      const newChild = deleteFromLayout(item.props.child, targetId);
      if (newChild !== item.props.child) {
        changed = true;
        updatedItem = {
          ...item,
          props: {
            ...item.props,
            child: newChild,
          },
        };
      }
    }

    return updatedItem;
  });

  if (!changed) return layout;

  // Filter out the deleted (null) items
  return newLayout.filter(Boolean) as Layout[];
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

export const generateNewIds = (copied: Layout) => {
  const newProps = { ...copied.props };

  if (copied.props?.child) {
    newProps.child = copied.props.child.map((child: Layout) =>
      generateNewIds(child)
    );
  }

  return {
    ...copied,
    id: uuidv4(),
    props: newProps,
  };
};

export const hasType = (layout: Layout[], type: string): boolean => {
  for (const item of layout) {
    if (item.type === type) {
      return true; // Found the target element
    }

    // If the item has children, search recursively
    if (item.props?.child) {
      const found = hasType(item.props.child, type);
      if (found) return true;
    }
  }
  return false; // Return undefined if not found
};

export const insertElement = (
  state: EditorState,
  layout: Layout[],
  newElement: Layout,
  addLocation: AddLocation,
  targetId: StringOrUnd,
  pushIfNoActive: boolean
) => {
  if (!addLocation) {
    // No specific location, add to the active item's child or the main layout
    if (targetId) {
      for (let i = 0; i < layout.length; i++) {
        if (layout[i].id === targetId) {
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
            targetId,
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
        targetId,
        pushIfNoActive
      );
    }
  }

  return layout;
};

export const moveToNextOrPreviousInner = (
  state: EditorState,
  payload: MoveTo
) => {
  const item = payload.item;
  const location = payload.location;

  const moveInArray = (arr: Layout[]): boolean => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === item.id) {
        if (location === "previous") {
          if (i === 0) {
            // Can't move, already first
            toast.error(
              "This element is the first element in its parent and can't be moved further"
            );
            return true;
          }
          [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
        } else if (location === "next") {
          if (i === arr.length - 1) {
            // Can't move, already last
            toast.error(
              "This element is the last element in its parent and can't be moved further"
            );
            return true;
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
  return state.layout;
};

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
