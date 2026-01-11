"use client";
import { useUser } from "@/features/auth/utils/contexts/UserContext";
import {
  getPortalLink,
  getUserAction,
} from "@/features/auth/utils/userActions";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import MiniLoadingSvg from "../../../../components/MiniLoadingSvg";
import { usePaddle } from "../../utils/contexts/PaddleContext";
import { checkSub } from "@/utils/Helpers";
import { env } from "@/utils/config";

const Subscribe = ({ user }: { user: Record<string, any> }) => {
  const [userInContext] = useUser();
  const [paddle] = usePaddle();
  const isSubscribed = checkSub(userInContext);
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

        const { portalLink, error } = await getPortalLink(
          userFetched.paddleCustomerId
        );

        if (error) {
          toast.error(error);
        } else if (portalLink) {
          setLink(portalLink);
        }
      } else {
        setLink("");
      }
      setLoading(false);
    };

    get();
  }, [isSubscribed]);

  if (!userInContext)
    return (
      <p className="m-2 text-deleteRed">Could not get user in context...</p>
    );

  if (loading) {
    return (
      <p className="ms-4 ">
        <MiniLoadingSvg />
      </p>
    );
  }

  return (
    <div className="mb-2">
      <Link
        target="_blank"
        href={link}
        onClick={(e) => {
          if (!isSubscribed) {
            e.preventDefault();

            if (!paddle) return toast.error("Paddle not initialized");

            paddle.Checkout.open({
              items: [
                {
                  priceId: env.NEXT_PUBLIC_PADDLE_SUB_PRICE_ID,
                  quantity: 1,
                },
              ],
              settings: {
                displayMode: "overlay",
              },
              customer: {
                email: user.userId,
              },
              customData: { userId: user.userId },
            });
          }
        }}
        className="p-1 text-black bg-amber rounded cursor-pointer"
      >
        {isSubscribed ? "Manage Subscription" : "Subscribe"}
      </Link>
      <div className="m-4 text-xs text-muted-foreground italic ">
        * Wait up to 15 seconds for your sub status to change after payment
        changes.
      </div>
    </div>
  );
};

export default Subscribe;
