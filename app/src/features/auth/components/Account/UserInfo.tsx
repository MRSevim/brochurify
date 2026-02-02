"use client";
import React from "react";
import Icon from "../../../../components/Icon";
import { FaTimes } from "react-icons/fa";
import { useUser } from "@/features/auth/utils/contexts/UserContext";
import { checkSub } from "../../utils/helpers";

const UserInfo = () => {
  const [user] = useUser();
  if (!user) return;
  return (
    <ul className="mb-2 list-none">
      <li>
        <strong>Username</strong>:{user.username}
      </li>
      <li>
        {" "}
        <strong>Email</strong>:{user.userId}
      </li>
      <li className="flex items-center">
        <strong>Subscription Status</strong>:
        {checkSub(user) ? (
          <span className="flex items-center text-positiveGreen font-semibold">
            <Icon type="check2" size="24px" title="Checkbox" className="mx-1" />{" "}
            Subscribed
          </span>
        ) : (
          <span className="flex items-center text-deleteRed font-semibold">
            <FaTimes className="text-[24px] mx-1" />
            Not Subscribed
          </span>
        )}
      </li>
    </ul>
  );
};

export default UserInfo;
