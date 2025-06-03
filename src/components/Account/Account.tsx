import { notFound } from "next/navigation";
import DeleteAccount from "./DeleteAccount";
import { getUserAction } from "@/utils/serverActions/userActions";
import UserInfo from "./UserInfo";
import Subscribe from "./Subscribe";

const Account = async () => {
  const { user } = await getUserAction();

  if (!user) {
    notFound();
  }
  return (
    <div className="mt-2">
      {" "}
      <UserInfo user={user} />
      <Subscribe />
      <DeleteAccount />
    </div>
  );
};

export default Account;
