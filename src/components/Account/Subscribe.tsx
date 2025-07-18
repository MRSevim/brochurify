"use client";
import { useUser } from "@/contexts/UserContext";
import {
  getPortalLink,
  getUserAction,
} from "@/utils/serverActions/userActions";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Paddle } from "@paddle/paddle-js";
import MiniLoadingSvg from "../MiniLoadingSvg";

const Subscribe = ({ user }: { user: Record<string, any> }) => {
  const [userInContext] = useUser();
  const [paddle, setPaddle] = useState<Paddle>();
  const isSubscribed = userInContext?.roles?.includes("subscriber");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);

  //paddle is not immediately initialized so we wait for it to initialize here
  useEffect(() => {
    let cancelled = false;

    const waitForPaddle = async (timeoutMs = 3000) => {
      const interval = 100; // check every 100ms
      const maxAttempts = Math.ceil(timeoutMs / interval);
      let attempts = 0;

      while (!cancelled && attempts < maxAttempts) {
        if (window.Paddle) {
          setPaddle(window.Paddle);
          return;
        }
        await new Promise((res) => setTimeout(res, interval));
        attempts++;
      }

      if (!cancelled) {
        console.warn("Paddle failed to load within timeout");
      }
    };

    waitForPaddle();

    return () => {
      cancelled = true; // cleanup if component unmounts
    };
  }, []);

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
        updatePaddleRetainId(userFetched.paddleCustomerId);

        if (error) {
          toast.error(error);
        } else if (portalLink) {
          setLink(portalLink);
        }
      } else {
        updatePaddleRetainId("");
      }
      setLoading(false);
    };

    if (!paddle) return;
    get();
  }, [isSubscribed, paddle]);

  const updatePaddleRetainId = (id: string) => {
    if (process.env.NEXT_PUBLIC_PADDLE_ENV === "production") {
      if (!paddle) return console.warn("Paddle not initialized");
      if (id) {
        paddle.Update({
          pwCustomer: {
            id,
          },
        });
      } else {
        paddle.Update({
          pwCustomer: {},
        });
      }
      console.log("retain id updated");
    }
  };

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

            if (!paddle) return console.warn("Paddle not initialized");

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
