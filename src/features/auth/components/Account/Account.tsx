import DeleteAccount from "./DeleteAccount";
import UserInfo from "./UserInfo";
import Subscribe from "./Subscribe";
import { getUserAction } from "../../utils/serverActions/userActions";
import { notFound } from "next/navigation";

const Account = async () => {
  const { user } = await getUserAction();
  if (!user) {
    notFound();
  }

  return (
    <div className="mt-2">
      <UserInfo />
      <Subscribe />
      <DeleteAccount />
    </div>
  );
};

export default Account;
