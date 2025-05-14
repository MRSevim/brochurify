import { useEffect } from "react";
import { runIntersectionObserver } from "../Helpers";
import { ElementRefObject } from "../Types";

export const useIntersectionObserver = (
  arr: any[],
  ref: ElementRefObject | undefined
) => {
  useEffect(() => {
    if (!ref) {
      const observer = runIntersectionObserver(undefined);

      return () => observer.disconnect(); // Clean up on unmount
    } else {
      if (!ref.current) return;

      const observer = runIntersectionObserver(ref.current);

      return () => observer.disconnect(); // Clean up on unmount
    }
  }, arr);
};
