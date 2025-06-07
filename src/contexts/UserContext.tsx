"use client";
import { setCookie } from "@/utils/Helpers";
import { User } from "@/utils/Types";
import { useContext, useState, createContext } from "react";

type UserContext = [User, (user: User, rememberMe: boolean) => void];

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

  const changeUser = (user: User, rememberMe: boolean) => {
    if (!user) {
      setCookie("user", "", 0);
      setUser(undefined);
      return;
    }
    const userString = encodeURIComponent(
      JSON.stringify({
        username: user.username,
        image: user.image,
        roles: user.roles,
      })
    );
    if (rememberMe) {
      setCookie("user", userString, 30);
    } else {
      setCookie("user", userString, 0);
    }

    setUser(user);
  };

  return (
    <userContext.Provider value={[user, changeUser]}>
      {children}
    </userContext.Provider>
  );
};
