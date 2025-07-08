"use client";
import DeleteAccount from "./DeleteAccount";
import UserInfo from "./UserInfo";
import Subscribe from "./Subscribe";
import { useUser } from "@/contexts/UserContext";
import MiniLoadingSvg from "../MiniLoadingSvg";

const Account = () => {
  const [user] = useUser();

  return (
    <div className="mt-2">
      {" "}
      {!user && <MiniLoadingSvg />}
      {user && (
        <>
          <UserInfo user={user} />
          <Subscribe user={user} />
          <DeleteAccount />
        </>
      )}
    </div>
  );
};

export default Account;
