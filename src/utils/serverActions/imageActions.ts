"use server";
import { cookies } from "next/headers";
import {
  deleteUserImageAndUpdateLibrary,
  getUserImages,
  uploadUserImageAndUpdateLibrary,
} from "../../lib/db/imageHelpers";

export const uploadAction = async (
  base64: string,
  fileType: string,
  isIcon: boolean
) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value || "";
    const newImage = await uploadUserImageAndUpdateLibrary({
      token,
      base64,
      fileType,
      isIcon,
    });
    return { newImage, error: "" };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const deleteAction = async (imageUrl: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value || "";

    await deleteUserImageAndUpdateLibrary({
      token,
      imageUrl,
    });
    return { error: "" };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getAction = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value || "";

    const images = await getUserImages(token);
    return { images, error: "" };
  } catch (error: any) {
    return { error: error.message };
  }
};
