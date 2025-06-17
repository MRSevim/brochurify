import { useEffect } from "react";
import { useUser } from "@/contexts/UserContext";

export function useSyncUser() {
  const [, , updateExistingUser] = useUser();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchUser = async () => {
      try {
        if (document.visibilityState !== "visible") return;

        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const user = await res.json();
          updateExistingUser(user);
        }
      } catch (error: any) {
        console.error("Error fetching user:", error.message);
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
