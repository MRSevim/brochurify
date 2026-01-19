"use client";
import React from "react";
import { useState } from "react";
import MiniLoadingSvg from "../../../../components/MiniLoadingSvg";
import ConfirmationPopup from "../../../../components/ConfirmationPopup";
import { toast } from "react-toastify";
import { deleteUserAction } from "@/features/auth/utils/serverActions/userActions";

const DeleteAccount = () => {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <div className="flex justify-center">
        <button
          className="bg-deleteRed p-2 rounded text-white hover:scale-110"
          onClick={() => {
            setConfirming(true);
          }}
        >
          {loading && <MiniLoadingSvg />}
          {!loading && "Delete Account"}
        </button>
      </div>
      {confirming && (
        <ConfirmationPopup
          loading={loading}
          text="Please note that all your data (sites, projects, images etc.) will be deleted permanently!"
          onClose={() => setConfirming(false)}
          onConfirm={async () => {
            setLoading(true);
            const { error } = await deleteUserAction();
            if (error) {
              toast.error(error);
            }
            setLoading(false);
          }}
        />
      )}
    </>
  );
};

export default DeleteAccount;
