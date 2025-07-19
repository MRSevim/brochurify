"use client";
import { useContext, useState, createContext, useEffect } from "react";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { PaddleEnv } from "@/utils/Types";
import { useUser } from "./UserContext";
import { getUserAction } from "@/utils/serverActions/userActions";

type PaddleContext = [Paddle | undefined];

const paddleContext = createContext<PaddleContext | undefined>(undefined);

export const usePaddle = (): PaddleContext => {
  const context = useContext(paddleContext);
  if (!context) {
    throw new Error("usePaddle must be used within a PaddleContextProvider");
  }
  return context;
};

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [paddle, setPaddle] = useState<Paddle>();
  const [userInContext] = useUser();
  const isSubscribed = userInContext?.roles?.includes("subscriber");

  useEffect(() => {
    initializePaddle({
      environment: process.env.NEXT_PUBLIC_PADDLE_ENV as PaddleEnv,
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
      ...(process.env.NEXT_PUBLIC_PADDLE_ENV === "production"
        ? {
            pwCustomer: {},
          }
        : {}),
    }).then((paddle) => setPaddle(paddle));
  }, []);

  useEffect(() => {
    const get = async () => {
      if (isSubscribed) {
        const { user } = await getUserAction();
        if (!user) {
          return console.warn("Could not fetch user in paddleContext");
        }
        updatePaddleRetainId(user.paddleCustomerId);
      } else {
        updatePaddleRetainId("");
      }
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
  return (
    <paddleContext.Provider value={[paddle]}>{children}</paddleContext.Provider>
  );
};
