import { useEffect } from "react";
import { useUser } from "@/features/auth/utils/contexts/UserContext";

export function useSyncUser() {
  const [, setUser] = useUser();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchUser = async () => {
      try {
        if (document.visibilityState !== "visible") return;

        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const user = await res.json();
          setUser(user);
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
