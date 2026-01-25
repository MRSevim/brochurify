import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { AddLocation, EditorState, ItemAndLocation } from "./types/types.d";
import { Layout } from "./types/propTypes.d";

export const moveElementInner = (
  state: EditorState,
  payload: ItemAndLocation,
) => {
  if (payload.addLocation?.id === payload.item?.id) return;
  const currentElement = payload.item;
  const targetId = payload.targetId;
  if (!currentElement) {
    toast.error("Something went wrong");
    return;
  }
  const child =
    "child" in currentElement.props ? currentElement.props.child : undefined;

  if (!targetId && !payload.addLocation) return;
  const targetElement = findElementById(state.layout, targetId || "");
  const passed = canElementHaveChild(
    state,
    payload.addLocation,
    currentElement,
    targetElement,
  );
  if (passed) {
    if (
      (targetId && isInChildren(child, targetId)) ||
      (payload.addLocation?.id && isInChildren(child, payload.addLocation.id))
    ) {
      toast.error("You cannot insert an element into its own children");
      return;
    }
    deleteFromLayout(state.layout, currentElement.id);
    // Add the element to its new location
    insertElement(
      state.layout,
      currentElement,
      payload.addLocation,
      targetId,
      false,
    );
  }
};

export const removeHistoryCurrents = (state: EditorState) => {
  for (const item of state.history) {
    item.current = false;
  }
};

export const canElementHaveChild = (
  state: EditorState,
  addLocation: AddLocation,
  newElement: Layout,
  targetElement: Layout | undefined,
) => {
  const parentElements = ["column", "row", "button", "container", "fixed"];

  // Helper function to check if targetId is inside a button by tracking parent types
  const isInsideButton = (layout: Layout[], targetId: string): boolean => {
    const findParentChain = (
      layout: Layout[],
      targetId: string,
    ): string[] | null => {
      for (const element of layout) {
        if (element.id === targetId) {
          return [element.type]; // Return the current element type if it's the target
        }
        // If the element has children, recursively search and track the chain
        if ("child" in element.props && element.props.child.length > 0) {
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

// Helper function to check if the target ID is within the layout passed
export const isInChildren = (
  children: Layout[] | undefined,
  targetId: string,
): boolean => {
  if (!children) return false;
  for (const child of children) {
    if (
      child.id === targetId ||
      isInChildren(
        "child" in child.props ? child.props.child : undefined,
        targetId,
      )
    ) {
      return true; // Target ID found in children
    }
  }
  return false;
};

export const deleteFromLayout = (
  layout: Layout[],
  targetId: string,
): boolean => {
  let deleted = false;

  for (let i = layout.length - 1; i >= 0; i--) {
    const item = layout[i];

    if (item.id === targetId) {
      layout.splice(i, 1);
      deleted = true;
      continue;
    }

    if ("child" in item.props) {
      const childDeleted = deleteFromLayout(item.props.child, targetId);
      if (childDeleted) {
        deleted = true;
      }
    }
  }

  return deleted;
};

export const findElementById = (
  layout: Layout[],
  targetId: string | undefined,
): Layout | undefined => {
  for (const item of layout) {
    if (item.id === targetId) {
      return item; // Found the target element
    }

    // If the item has children, search recursively
    if ("child" in item.props) {
      const found = findElementById(item.props.child, targetId);
      if (found) return found; // Return if the target is found in children
    }
  }
  return undefined; // Return undefined if not found
};

export const generateNewIds = (copied: Layout): Layout => {
  const newProps = { ...copied.props };

  if ("child" in copied.props && "child" in newProps) {
    newProps.child = copied.props.child.map((child: Layout) =>
      generateNewIds(child),
    );
  }

  return {
    ...copied,
    id: uuidv4(),
    props: newProps,
  } as Layout;
};

export const hasType = (layout: Layout[], type: string): boolean => {
  for (const item of layout) {
    if (item.type === type) {
      return true; // Found the target element
    }

    // If the item has children, search recursively
    if ("child" in item.props) {
      const found = hasType(item.props.child, type);
      if (found) return true;
    }
  }
  return false; // Return undefined if not found
};

export const insertElement = (
  layout: Layout[],
  newElement: Layout,
  addLocation: AddLocation,
  targetId: string | undefined,
  pushIfNoActive: boolean,
): void => {
  if (!addLocation) {
    if (targetId) {
      for (let i = 0; i < layout.length; i++) {
        if (layout[i].id === targetId) {
          if (!("child" in layout[i].props)) {
            (layout[i].props as { child: Layout[] }).child = [];
          }
          (layout[i].props as { child: Layout[] }).child.push(newElement);
          return;
        }

        if ("child" in layout[i].props) {
          insertElement(
            (layout[i].props as { child: Layout[] }).child,
            newElement,
            addLocation,
            targetId,
            pushIfNoActive,
          );
        }
      }
    } else if (pushIfNoActive) {
      layout.push(newElement);
    }
    return;
  }

  for (let i = 0; i < layout.length; i++) {
    if (layout[i].id === addLocation.id) {
      if (addLocation.where === "before") {
        layout.splice(i, 0, newElement);
      } else if (addLocation.where === "after") {
        layout.splice(i + 1, 0, newElement);
      }
      return;
    }

    if ("child" in layout[i].props) {
      insertElement(
        (layout[i].props as { child: Layout[] }).child,
        newElement,
        addLocation,
        targetId,
        pushIfNoActive,
      );
    }
  }
};

export function deepClone<T>(obj: T): T {
  if (typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as T;
  }

  const copy: Record<string, any> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepClone(obj[key]);
    }
  }

  return copy as T;
}
