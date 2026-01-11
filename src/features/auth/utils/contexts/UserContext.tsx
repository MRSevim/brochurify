"use client";
import { getCookie, setCookie } from "@/utils/Helpers";
import { User } from "@/utils/Types";
import { useContext, useState, createContext } from "react";

type UserContext = [
  User,
  (user: User, rememberMe: boolean) => void,
  (user: User) => void,
];

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
  const [user, setU] = useState(UserFromCookie);

  const setUser = (user: any) => {
    if (!user) {
      return setU(undefined);
    }
    setU({
      username: user?.username,
      image: user?.image,
      roles: user?.roles,
    });
  };

  const unsetUser = () => {
    setCookie("user", "", 0);
    setCookie("userExpirationDate", "", 0);
    setUser(undefined);
  };
  const getUserString = (user: User) =>
    encodeURIComponent(
      JSON.stringify({
        username: user?.username,
        image: user?.image,
        roles: user?.roles,
      })
    );
  const changeUser = (user: User, rememberMe: boolean) => {
    if (!user) {
      return unsetUser();
    }

    const userString = getUserString(user);
    if (rememberMe) {
      setCookie("user", userString, 30, true);
    } else {
      setCookie("user", userString, 0);
    }

    setUser(user);
  };

  const updateExistingUser = (user: User) => {
    if (!user) {
      return unsetUser();
    }

    const userString = getUserString(user);
    const expirationDateStr = getCookie("userExpirationDate");
    if (expirationDateStr) {
      const expirationDate = new Date(decodeURIComponent(expirationDateStr));
      const now = new Date();

      if (expirationDate > now) {
        // Calculate the expires string in UTC format exactly as expirationDate
        const expires = expirationDate.toUTCString();
        // Create the cookie string with exact expires date
        document.cookie = `user=${userString}; path=/; expires=${expires}`;
        setUser(user);
        return;
      }
    }

    // Fallback to session cookie if no expiration date or expired
    setCookie("user", userString, 0);
    setUser(user);
  };

  return (
    <userContext.Provider value={[user, changeUser, updateExistingUser]}>
      {children}
    </userContext.Provider>
  );
};
