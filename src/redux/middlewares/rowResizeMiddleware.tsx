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

// Recursive update that preserves references unless changes are made
const updateWidths = (
  nodes: Layout[],
  prevCounts: Record<string, number>
): [Layout[], boolean] => {
  let changed = false;

  const updatedNodes = nodes.map((node) => {
    let updatedNode = node;

    if (node.type === "row" && Array.isArray(node.props.child)) {
      const prevCount = prevCounts[node.id] ?? 0;
      const nonFixedChildren = node.props.child.filter(
        (c) => c.type !== "fixed"
      );
      const currCount = nonFixedChildren.length;

      let childChanged = false;
      let newChildArray = node.props.child;

      // If non-fixed count changed, update widths
      if (prevCount !== currCount && currCount > 0) {
        const newWidth = `${100 / currCount}%`;
        const updatedChildren = node.props.child.map((child) => {
          if (child.type === "fixed") return child;

          const currentWidth = child.props.style?.width ?? "";
          if (currentWidth === newWidth) return child;

          childChanged = true;
          return {
            ...child,
            props: {
              ...child.props,
              style: {
                ...child.props.style,
                width: newWidth,
              },
            },
          };
        });

        if (childChanged) {
          newChildArray = updatedChildren;
        }
      }
      // Recurse into children
      const [recursedChild, childRecursedChanged] = updateWidths(
        newChildArray,
        prevCounts
      );

      if (childChanged || childRecursedChanged) {
        if (node.props.child !== recursedChild) {
          updatedNode = {
            ...node,
            props: {
              ...node.props,
              child: recursedChild,
            },
          };
          changed = true;
        }
      }
    } else if (Array.isArray(node.props.child)) {
      // Recurse into non-row nodes
      const [recursedChild, childChanged] = updateWidths(
        node.props.child,
        prevCounts
      );
      if (childChanged) {
        updatedNode = {
          ...node,
          props: {
            ...node.props,
            child: recursedChild,
          },
        };
        changed = true;
      }
    }

    return updatedNode;
  });

  return [changed ? updatedNodes : nodes, changed];
};

export const rowResizeMiddleware: Middleware =
  (store) => (next) => (action) => {
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

    const result = next(action); // Let reducers update layout

    const nextState = store.getState() as RootState;
    const currentLayout = nextState.editor.layout;

    const [newLayout, layoutChanged] = updateWidths(currentLayout, prevCounts);

    if (layoutChanged) {
      store.dispatch(updateLayout(newLayout));
    }

    return result;
  };
