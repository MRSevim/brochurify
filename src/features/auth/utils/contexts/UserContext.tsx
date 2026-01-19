"use client";
import { User } from "../types";
import {
  useContext,
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

type UserContext = [User, Dispatch<SetStateAction<User>>];

const userContext = createContext<UserContext | undefined>(undefined);

export const useUser = (): UserContext => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const Provider = ({
  children,
  UserFromCookie,
}: {
  children: React.ReactNode;
  UserFromCookie: User;
}) => {
  const [user, setUser] = useState(UserFromCookie);

  useEffect(() => {
    setUser(UserFromCookie);
  }, [UserFromCookie]);

  return (
    <userContext.Provider value={[user, setUser]}>
      {children}
    </userContext.Provider>
  );
};
