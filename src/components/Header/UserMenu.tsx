import { useUser } from "@/contexts/UserContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ToggleButton } from "../LeftPanel";
import { logoutAction } from "@/utils/serverActions/userActions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const UserMenu = () => {
  const [user, setUser] = useUser();
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const logout = async () => {
    setUser(undefined, false);
    const { error } = await logoutAction();
    if (error) {
      toast.error(error);
    } else {
      setExpanded(false);
      router.push("/");
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = expanded
        ? `${contentRef.current.scrollHeight}px`
        : "0px";
    }
  }, [expanded]);

  return (
    <div className="w-20">
      {user && (
        <>
          <div className="bg-text text-background rounded p-2 relative">
            <div className="flex">
              <Image
                className="rounded-full"
                src={user.image}
                width={40}
                height={40}
                alt="Profile picture"
              />
              <ToggleButton
                toggled={expanded}
                onClick={() => setExpanded((prev) => !prev)}
              />
            </div>

            <div
              ref={contentRef}
              className="overflow-hidden transition-all duration-300 absolute bg-text color-background rounded right-0 top-full mt-1"
              style={{ height: "0px", width: "200%" }}
            >
              <div className="flex flex-col gap-2 p-2 items-center">
                <div className="border-b-4">Welcome, {user.username}</div>
                <Link
                  href="/my-projects"
                  className="text-center"
                  onClick={() => setExpanded(false)}
                >
                  <span className="hover:underline">My projects</span>
                </Link>
                <button onClick={logout}>
                  {" "}
                  <span className="hover:underline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {user === undefined && (
        <Link href="/register">
          <span>Register</span>
        </Link>
      )}
    </div>
  );
};

export default UserMenu;
