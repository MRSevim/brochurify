import { Middleware } from "@reduxjs/toolkit";
import { Layout } from "@/utils/Types";
import { RootState } from "../store";
import {
  hydrate,
  redo,
  undo,
  updateLayout,
  hydrateLocal,
  setFromLocal,
} from "../slices/editorSlice";

// Utility to count non-fixed children of row nodes
const getRowNonFixedCounts = (
  nodes: Layout[],
  acc: Record<string, number> = {}
) => {
  for (const node of nodes) {
    if (node.type === "row" && Array.isArray(node.props.child)) {
      const count = node.props.child.filter(
        (child) => child.type !== "fixed"
      ).length;
      acc[node.id] = count;
    }
    if (Array.isArray(node.props.child)) {
      getRowNonFixedCounts(node.props.child, acc);
    }
  }
  return acc;
};

// Deep clone the layout (to safely mutate style)
const deepCloneLayout = (nodes: Layout[]): Layout[] => {
  return nodes.map((node) => ({
    ...node,
    props: {
      ...node.props,
      style: { ...node.props.style },
      child: Array.isArray(node.props.child)
        ? deepCloneLayout(node.props.child)
        : undefined,
    },
  }));
};

export const rowResizeMiddleware: Middleware =
  (store) => (next) => (action) => {
    // Skip if it's a non-layout-altering action
    if (
      undo.match(action) ||
      redo.match(action) ||
      hydrate.match(action) ||
      hydrateLocal.match(action) ||
      setFromLocal.match(action)
    ) {
      return next(action);
    }

    const prevLayout = (store.getState() as RootState).editor.layout;
    const prevCounts = getRowNonFixedCounts(prevLayout);

    const result = next(action); // Let reducers run first

    const nextState = store.getState() as RootState;
    const currentLayout = nextState.editor.layout;

    let layoutChanged = false;
    const clonedLayout = deepCloneLayout(currentLayout);

    const adjustWidthsIfNeeded = (nodes: Layout[]) => {
      for (const node of nodes) {
        if (node.type === "row" && Array.isArray(node.props.child)) {
          const prevCount = prevCounts[node.id] ?? 0;
          const currNonFixedChildren = node.props.child.filter(
            (c) => c.type !== "fixed"
          );
          const currCount = currNonFixedChildren.length;

          if (prevCount !== currCount && currCount > 0) {
            const newWidth = `${100 / currCount}%`;

            for (const child of currNonFixedChildren) {
              child.props.style = {
                ...child.props.style,
                width: newWidth,
              };
            }

            layoutChanged = true;
          }
        }

        if (Array.isArray(node.props.child)) {
          adjustWidthsIfNeeded(node.props.child);
        }
      }
    };

    adjustWidthsIfNeeded(clonedLayout);

    if (layoutChanged) {
      store.dispatch(updateLayout(clonedLayout));
    }

    return result;
  };
