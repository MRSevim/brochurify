"use server";
import { returnErrorFromUnknown } from "@/utils/Helpers";
import {
  deleteUserImageAndUpdateLibrary,
  getUserImages,
  uploadUserImageAndUpdateLibrary,
} from "../../lib/db/imageHelpers";

export const uploadAction = async (
  base64: string,
  fileType: string,
  isIcon: boolean,
) => {
  try {
    const newImage = await uploadUserImageAndUpdateLibrary({
      base64,
      fileType,
      isIcon,
    });
    return { newImage, error: "" };
  } catch (error) {
    return { newImage: undefined, ...returnErrorFromUnknown(error) };
  }
};

export const deleteAction = async (imageUrl: string) => {
  try {
    await deleteUserImageAndUpdateLibrary({
      imageUrl,
    });
    return { error: "" };
  } catch (error: any) {
    return returnErrorFromUnknown(error);
  }
};

export const getAction = async () => {
  try {
    const images = await getUserImages();
    return { images, error: "" };
  } catch (error: any) {
    return { images: undefined, ...returnErrorFromUnknown(error) };
  }
};
