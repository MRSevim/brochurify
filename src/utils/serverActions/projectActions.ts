"use server";
import { revalidatePath } from "next/cache";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  updateProject,
} from "../db/projectHelpers";
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

export const updateAction = async (
  id: string,
  updates: Partial<{ title: string; editor: EditorState }>
) => {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt")?.value;

    await updateProject(jwt, id, updates);

    revalidatePath("/my-projects");

    return "";
  } catch (error: any) {
    return error.message;
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

export const getProjectAction = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt")?.value;

    const project = await getProjectById(jwt, id);
    return project;
  } catch (error: any) {
    return;
  }
};

export const deleteAction = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt")?.value;
    await deleteProject(jwt, id);
    revalidatePath("/my-projects");
    return "";
  } catch (error: any) {
    return error.message;
  }
};
