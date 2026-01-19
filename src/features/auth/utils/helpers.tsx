import { User } from "./types";

export const checkSub = (user: User) => {
  if (!user) return false;
  return user?.roles?.includes("subscriber");
};
