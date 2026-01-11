"use client";
import { useState } from "react";
import EditButton from "../../../components/EditButton";
import { DeleteComponent } from "./DeleteComponent";
import { updateAction } from "@/features/projects/utils/serverActions/projectActions";
import { toast } from "react-toastify";

const TopBar = ({
  type,
  project,
}: {
  type: string;
  project: Record<string, any>;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(project.title);
  const [loading, setLoading] = useState(false);
  const saveChanges = async () => {
    if (title !== project.title) {
      setLoading(true);
      const { error } = await updateAction(type, project.id, { title });
      if (error) {
        toast.error(error);
      }

      setLoading(false);
    }
  };

  const handleEditClick = async () => {
    if (isEditing) {
      await saveChanges();
    }

    setIsEditing((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const nextFocused = e.relatedTarget;

    // If next focus is the edit/save button, ignore blur
    if (nextFocused?.classList.contains("edit-button")) return;

    if (isEditing) {
      await saveChanges();
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-wrap justify-between w-full">
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
        <DeleteComponent type={type} project={project} />
      </div>
    </div>
  );
};

export default TopBar;
