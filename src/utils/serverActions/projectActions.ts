"use server";

import { createProject } from "../db/projectHelpers";
import { EditorState } from "../Types";
import { cookies } from "next/headers";

export const createAction = async (project: {
  title: string;
  editor: Partial<EditorState>;
}) => {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt")?.value;

    await createProject(project, jwt);

    return { error: "" };
  } catch (error: any) {
    return { error: error.message };
  }
};
