import React from "react";

const UserInfo = ({ user }: { user: Record<string, any> }) => {
  return (
    <ul className="mb-2">
      <li>Username:{user.username}</li>
      <li>Email:{user.userId}</li>
      <li>Status:{user.role}</li>
    </ul>
  );
};

export default UserInfo;
