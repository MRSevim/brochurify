import { getLemonSqueezyPortalLink } from "@/utils/serverActions/helpers";
import Link from "next/link";
import { useEffect, useState } from "react";

const Subscribe = ({ user }: { user: Record<string, any> }) => {
  const isSubscribed = user.roles.includes("subscriber");
  const [link, setLink] = useState("");

  useEffect(() => {
    const get = async () => {
      if (isSubscribed) {
        const portalLink = await getLemonSqueezyPortalLink(user.subscriptionId);
        if (portalLink) {
          setLink(portalLink);
        }
      } else {
        setLink(
          "https://brochurify.lemonsqueezy.com/buy/c506f80c-b610-4127-ad25-60911d700002?checkout[custom][user_id]=" +
            user.userId
        );
      }
    };
    get();
  }, [isSubscribed]);

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
