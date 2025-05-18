"use client";
import { useUser } from "@/contexts/UserContext";
import { useEffect, useState } from "react";
import { User } from "@/utils/Types";
import Checkbox from "@/components/Checkbox";
import { GoogleLoginComp } from "@/components/googleLoginComp";
import { toast } from "react-toastify";
import Container from "@/components/Container";

export const page = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [, setUser] = useUser();
  const [error, setError] = useState("");

  const handleBefore = () => {
    setError("");
  };
  const handleAfter = async (error: string, user: User) => {
    if (error) {
      setError(error);
      return;
    }
    setUser(user, rememberMe);
  };

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <Container>
      <div className="mt-20 bg-background shadow-lg rounded-2xl mx-auto p-4 max-w-md w-full text-center text-text flex flex-col gap-3">
        <GoogleLoginComp
          handleBefore={handleBefore}
          handleAfter={handleAfter}
          rememberMe={rememberMe}
        />
        <Checkbox
          title="Remember me for 30 days"
          checked={rememberMe}
          onChange={() => setRememberMe((prev) => !prev)}
        />
      </div>
    </Container>
  );
};
export default page;
