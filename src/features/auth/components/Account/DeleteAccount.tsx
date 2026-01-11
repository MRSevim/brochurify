"use client";
import React from "react";
import { useState } from "react";
import MiniLoadingSvg from "../../../../components/MiniLoadingSvg";
import ConfirmationPopup from "../../../../components/ConfirmationPopup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  deleteUserAction,
  logoutAction,
} from "@/features/auth/utils/userActions";
import { useUser } from "@/features/auth/utils/contexts/UserContext";

const DeleteAccount = () => {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [, setUser] = useUser();

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
            } else {
              setConfirming(false);
              await logoutAction();
              setUser(undefined, false);
              router.push("/");
            }
            setLoading(false);
          }}
        />
      )}
    </>
  );
};

export default DeleteAccount;
