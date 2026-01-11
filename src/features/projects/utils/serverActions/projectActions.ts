"use server";
import { revalidatePath } from "next/cache";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  getTemplates,
  scanPrefix,
  updateProject,
} from "../../lib/db/projectHelpers";
import { EditorState } from "../../../../utils/Types";
import { cookies } from "next/headers";

export const createAction = async (project: {
  type: string;
  title: string;
  editor: Partial<EditorState>;
  snapshot?: string;
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
  type: string,
  id: string,
  updates: Partial<{
    title: string;
    editor: EditorState;
    publish: {
      prefix?: string;
      published: boolean;
      editor?: EditorState;
    };
  }>
) => {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt")?.value;

    const updatedProject = await updateProject(type, jwt, id, updates);

    revalidatePath("/my-projects");

    return { prefix: updatedProject?.prefix, error: "" };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getAllAction = async (type: string) => {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt")?.value;

    const projects = await getAllProjects(type, jwt);
    return { projects, error: "" };
  } catch (error: any) {
    return { error: error.message };
  }
};
export const scanPrefixAction = async (prefix: string) => {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt")?.value;

    const projects = await scanPrefix(prefix, jwt);
    return { projects: projects || [], error: "" };
  } catch (error: any) {
    return { error: error.message };
  }
};
export const getAllTemplatesAction = async () => {
  try {
    const templates = await getTemplates();
    return { templates, error: "" };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getProjectAction = async (type: string, id: string) => {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt")?.value;

    const project = await getProjectById(type, jwt, id);
    return project;
  } catch (error: any) {
    return;
  }
};

export const deleteAction = async (type: string, id: string) => {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt")?.value;
    await deleteProject(type, jwt, id);
    revalidatePath("/my-projects");
    return "";
  } catch (error: any) {
    return error.message;
  }
};
