import { useEffect } from "react";
import { useUser } from "@/features/auth/utils/contexts/UserContext";
import { User } from "@/utils/Types";
import { getUserAction } from "./userActions";

export function useSyncUser() {
  const [, setUser] = useUser();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchUser = async () => {
      try {
        if (document.visibilityState !== "visible") return;

        const { user, error } = await getUserAction();

        if (error) {
          throw new Error(error);
        } else setUser(user as User);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    // Initial fetch
    fetchUser();

    // Set interval
    intervalId = setInterval(fetchUser, 15000);

    // Clear on unmount
    return () => clearInterval(intervalId);
  }, []);
}
