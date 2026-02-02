"use client";
import { useContext, useState, createContext, useEffect } from "react";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { useUser } from "./UserContext";
import { env } from "@/utils/config";
import { Environment } from "@paddle/paddle-node-sdk";

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
  const [user] = useUser();

  useEffect(() => {
    initializePaddle({
      environment:
        env.NEXT_PUBLIC_PADDLE_ENV === "sandbox"
          ? Environment.sandbox
          : Environment.production,
      token: env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
      ...(env.NEXT_PUBLIC_PADDLE_ENV === "production"
        ? {
            pwCustomer: {},
          }
        : {}),
    }).then((paddle) => setPaddle(paddle));
  }, []);

  useEffect(() => {
    const get = async () => {
      updatePaddleRetainId(user?.paddleCustomerId || "");
    };

    if (!paddle) return;
    get();
  }, [user, paddle]);

  const updatePaddleRetainId = (id: string) => {
    if (env.NEXT_PUBLIC_PADDLE_ENV === "production") {
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
    }
  };
  return (
    <paddleContext.Provider value={[paddle]}>{children}</paddleContext.Provider>
  );
};
