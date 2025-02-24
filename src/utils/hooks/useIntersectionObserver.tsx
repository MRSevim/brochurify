import { useEffect } from "react";
import { runIntersectionObserver } from "../Helpers";

export const useIntersectionObserver = (arr: any[]) => {
  useEffect(() => {
    const observer = runIntersectionObserver();

    return () => observer.disconnect(); // Clean up on unmount
  }, arr);
};
