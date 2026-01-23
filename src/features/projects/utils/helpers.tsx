import { EditorState } from "@/features/builder/utils/types/types.d";

export const stripEditorFields = (
  param: EditorState | Partial<EditorState>,
) => {
  const stripped = {
    layout: param.layout,
    pageWise: param.pageWise,
    variables: param.variables,
  };
  return stripped;
};

export const saveToLocalStorage = (param: EditorState) => {
  // Convert the state.layout to a JSON string
  const stripped = stripEditorFields(param);
  const val = JSON.stringify(stripped);

  localStorage.setItem("editor", val);
};
