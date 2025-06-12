import { getLemonSqueezyPortalLink } from "@/utils/serverActions/helpers";
import Link from "next/link";

const Subscribe = async ({ user }: { user: Record<string, any> }) => {
  const isSubscribed = user.roles.includes("subscriber");
  let link;
  if (isSubscribed) {
    /*   const portalLink = await getLemonSqueezyPortalLink(user.subscriptionId);
    link = portalLink; */
  } else {
    link =
      "https://brochurify.lemonsqueezy.com/buy/c506f80c-b610-4127-ad25-60911d700002?checkout[custom][user_id]=" +
      user.userId;
  }
  if (!link) return;

  return (
    <div className="mb-2">
      <Link
        target="_blank"
        href={link}
        className="lemonsqueezy-button p-1 text-black bg-amber rounded cursor-pointer"
      >
        {isSubscribed ? "Manage Subscription" : "Subscribe"}
      </Link>
      <script src="https://assets.lemonsqueezy.com/lemon.js" defer></script>
    </div>
  );
};

export default Subscribe;
