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
import { EditorState } from "@/features/builder/utils/types/types.d";
import { addNumberWithDash, returnErrorFromUnknown } from "@/utils/Helpers";

export const createAction = async (project: {
  type: string;
  title: string;
  editor: Partial<EditorState>;
  snapshot?: string;
}) => {
  try {
    await createProject(project);

    revalidatePath("/my-projects");

    return { error: "" };
  } catch (error) {
    return returnErrorFromUnknown(error);
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
  }>,
) => {
  try {
    const updatedProject = await updateProject(type, id, updates);

    revalidatePath("/my-projects");

    return { prefix: updatedProject?.prefix, error: "" };
  } catch (error) {
    return { prefix: "", ...returnErrorFromUnknown(error) };
  }
};

export const getAllAction = async (type: string) => {
  try {
    const projects = await getAllProjects(type);

    return { projects };
  } catch (error) {
    return { projects: undefined };
  }
};

export const scanPrefixAction = async (prefix: string) => {
  try {
    const projects = await scanPrefix(prefix);
    return { slugified: addNumberWithDash(prefix, projects.length), error: "" };
  } catch (error) {
    return { slugified: "", ...returnErrorFromUnknown(error) };
  }
};

export const getAllTemplatesAction = async () => {
  try {
    const templates = await getTemplates();
    return { templates, error: "" };
  } catch (error) {
    return { templates: undefined, ...returnErrorFromUnknown(error) };
  }
};

export const getProjectAction = async (type: string, id: string) => {
  try {
    const project = await getProjectById(type, id);
    return project;
  } catch (error) {
    return;
  }
};

export const deleteAction = async (type: string, id: string) => {
  try {
    await deleteProject(type, id);
    revalidatePath("/my-projects");
    return { error: "" };
  } catch (error) {
    return returnErrorFromUnknown(error);
  }
};
