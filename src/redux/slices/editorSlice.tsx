import { getDefaultElementProps, saveCookie } from "@/utils/Helpers";
import { AddLocation, EditorState, Layout } from "@/utils/Types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
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
        const insertElement = (
          layout: Layout[],
          newElement: Layout,
          addLocation: AddLocation
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
                    layout[i].props.child as Layout[],
                    newElement,
                    addLocation
                  );
                }
              }
            } else {
              // No active ID, add to the end of the main layout
              layout.push(newElement);
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
                layout[i].props.child as Layout[],
                newElement,
                addLocation
              );
            }
          }

          return layout;
        };

        const newElement = {
          id: uuidv4(),
          type: action.payload.type,
          props: getDefaultElementProps(action.payload.type),
        };

        state.layout = insertElement(
          state.layout || [],
          newElement,
          action.payload.addLocation
        );
        saveCookie(state.layout);
      }
    },
    deleteElement: (state, action: PayloadAction<string>) => {
      if (state.layout) {
        const deleteFromLayout = (
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

        // Update the layout by filtering out the target element
        state.layout = deleteFromLayout(state.layout || [], action.payload);
        saveCookie(state.layout);
      }
    },
  },
});

export const { setActive, addElement, deleteElement, hydrate } =
  editorSlice.actions;
export default editorSlice.reducer;
