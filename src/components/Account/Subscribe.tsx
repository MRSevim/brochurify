"use client";
import { useUser } from "@/contexts/UserContext";
import { getLemonSqueezyPortalLink } from "@/utils/serverActions/userActions";
import { getUserAction } from "@/utils/serverActions/userActions";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import MiniLoadingSvg from "../MiniLoadingSvg";

const Subscribe = ({ user }: { user: Record<string, any> }) => {
  const [userInContext] = useUser();

  if (!userInContext)
    return (
      <p className="m-2 text-deleteRed">Could not get user in context...</p>
    );
  const isSubscribed = userInContext.roles.includes("subscriber");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const get = async () => {
      setLoading(true);
      if (isSubscribed) {
        const { user: userFetched } = await getUserAction();
        if (!userFetched) {
          setLoading(false);
          return toast.error("Could not fetch subscriber info...");
        }

        const { portalLink, error } = await getLemonSqueezyPortalLink(
          userFetched.subscriptionId
        );
        if (error) {
          toast.error(error);
        } else if (portalLink) {
          setLink(portalLink);
        }
      } else {
        setLink(
          "https://brochurify.lemonsqueezy.com/buy/c506f80c-b610-4127-ad25-60911d700002?checkout[custom][user_id]=" +
            user.userId
        );
      }
      setLoading(false);
    };

    get();
  }, [isSubscribed]);

  if (loading) {
    return (
      <p className="ms-4 ">
        <MiniLoadingSvg />
      </p>
    );
  }

  if (!link) {
    return <p className="ms-4 text-deleteRed">Could not get link...</p>;
  }

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
