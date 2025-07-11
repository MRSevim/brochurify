"use client";
import { useUser } from "@/contexts/UserContext";
import {
  getPortalLink,
  getUserAction,
} from "@/utils/serverActions/userActions";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import MiniLoadingSvg from "../MiniLoadingSvg";
import { PaddleEnv } from "@/utils/Types";

const Subscribe = ({ user }: { user: Record<string, any> }) => {
  const [userInContext] = useUser();

  if (!userInContext)
    return (
      <p className="m-2 text-deleteRed">Could not get user in context...</p>
    );
  const isSubscribed = userInContext.roles.includes("subscriber");
  const [paddle, setPaddle] = useState<Paddle>();
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
        initializePaddle({
          environment: process.env.NEXT_PUBLIC_PADDLE_ENV as PaddleEnv,
          token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
        }).then((paddle) => setPaddle(paddle));
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

  return (
    <div className="mb-2">
      <Link
        target="_blank"
        href={link}
        onClick={(e) => {
          if (!isSubscribed) {
            e.preventDefault();
            if (!paddle) return alert("Paddle not initialized");

            paddle.Checkout.open({
              items: [
                {
                  priceId: process.env.NEXT_PUBLIC_PADDLE_SUB_PRICE_ID!,
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
