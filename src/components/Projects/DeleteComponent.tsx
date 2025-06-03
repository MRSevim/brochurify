"use client";
import { deleteAction } from "@/utils/serverActions/projectActions";
import DeleteButton from "../DeleteButton";
import { useState } from "react";
import ConfirmationPopup from "../ConfirmationPopup";
import { toast } from "react-toastify";

export const DeleteComponent = ({
  type,
  project,
}: {
  type: string;
  project: Record<string, any>;
}) => {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <>
      <DeleteButton onClick={() => setConfirming(true)} loading={loading} />
      {confirming && (
        <ConfirmationPopup
          loading={loading}
          onConfirm={async () => {
            setLoading(true);

            const error = await deleteAction(type, project.id);
            if (error) {
              toast.error(error);
            } else {
              setConfirming(false);
            }

            setLoading(false);
          }}
          onClose={() => setConfirming(false)}
          text={`Are you sure you want to delete ${type} titled "${project.title}"?`}
        />
      )}
    </>
  );
};
