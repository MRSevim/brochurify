"use server";
import { revalidatePath } from "next/cache";
import { createProject, getAllProjects } from "../db/projectHelpers";
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

    revalidatePath("/my-projects");

    return { error: "" };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getAllAction = async () => {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt")?.value;

    const projects = await getAllProjects(jwt);
    return { projects, error: "" };
  } catch (error: any) {
    return { error: error.message };
  }
};
