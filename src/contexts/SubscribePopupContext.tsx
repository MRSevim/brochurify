"use client";
import {
  SetStateAction,
  useContext,
  useState,
  Dispatch,
  createContext,
} from "react";
import { useUser } from "./UserContext";
import { checkSub } from "@/utils/Helpers";
import Popup from "@/components/Popup";
import PricingComparison from "@/components/Homepage/PricingComparison";
import { useRouter } from "next/navigation";

type SubscribePopup = [boolean, Dispatch<SetStateAction<boolean>>];

const subscribePopupContext = createContext<SubscribePopup | null>(null);

export const useSubscribePopup = (): SubscribePopup => {
  const context = useContext(subscribePopupContext);
  if (!context) {
    throw new Error(
      "useSubscribePopup must be used within a subscribePopupProvider"
    );
  }
  return context;
};

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [popup, setPopup] = useState(false);
  const [user] = useUser();
  const isSubbed = checkSub(user);
  const router = useRouter();

  return (
    <subscribePopupContext.Provider value={[isSubbed, setPopup]}>
      {popup && (
        <Popup
          className="max-w-4xl"
          onClose={() => setPopup(false)}
          onEditOrAdd={() => {
            router.push("/my-account");
            setPopup(false);
          }}
          positiveActionText="Subscribe"
        >
          <PricingComparison />
        </Popup>
      )}
      {children}
    </subscribePopupContext.Provider>
  );
};
