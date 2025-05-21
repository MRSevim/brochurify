"use client";
import { useState } from "react";
import EditButton from "../EditButton";
import { DeleteComponent } from "./DeleteComponent";
import { updateAction } from "@/utils/serverActions/projectActions";
import { toast } from "react-toastify";

const TopBar = ({ project }: { project: Record<string, any> }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(project.title);
  const [loading, setLoading] = useState(false);

  const saveChanges = async () => {
    if (title !== project.title) {
      setLoading(true);
      const error = await updateAction(project.id, { title });
      if (error) {
        toast.error(error);
      }

      setLoading(false);
    }
  };

  const handleEditClick = async () => {
    if (isEditing) {
      // User clicked "save"
      await saveChanges();
    }
    setIsEditing((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleBlur = async () => {
    if (isEditing) {
      await saveChanges();
      setIsEditing(false);
    }
  };

  return (
    <>
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
          className="font-bold text-l border p-1 rounded"
        />
      ) : (
        <p className="font-bold text-l">{title}</p>
      )}
      <div className="flex gap-2">
        <EditButton
          onClick={handleEditClick}
          editing={isEditing}
          loading={loading}
        />
        <DeleteComponent project={project} />
      </div>
    </>
  );
};

export default TopBar;
