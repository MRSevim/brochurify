import { RefObject, useEffect } from "react";
import { runIntersectionObserver } from "../../../../utils/Helpers";

export const useIntersectionObserver = (
  arr: any[],
  ref: RefObject<HTMLElement | null> | undefined,
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
