import DeleteAccount from "./DeleteAccount";
import UserInfo from "./UserInfo";
import Subscribe from "./Subscribe";
import { getUserAction } from "../../utils/userActions";
import { notFound } from "next/navigation";

const Account = async () => {
  const { user } = await getUserAction();
  if (!user) {
    notFound();
  }

  return (
    <div className="mt-2">
      <UserInfo user={user} />
      <Subscribe user={user} />
      <DeleteAccount />
    </div>
  );
};

export default Account;
