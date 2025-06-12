import { useEffect } from "react";
import { useUser } from "@/contexts/UserContext";

export function useSyncUser() {
  const [, , updateExistingUser] = useUser();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user/profile");

        if (res.ok) {
          const user = await res.json();
          updateExistingUser(user);
        }
      } catch (error: any) {
        console.error("Error fetching user ", error.message);
      }
    }

    fetchUser();
  }, []);
}
