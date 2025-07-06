"use client";
import { runIntersectionObserver } from "@/utils/Helpers";
import { useEffect } from "react";

export default function Effects({
  hideOverFlowBefore,
}: {
  hideOverFlowBefore: number;
}) {
  useEffect(() => {
    runIntersectionObserver(undefined);
  }, []);

  useEffect(() => {
    if (!hideOverFlowBefore) return;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    }, hideOverFlowBefore);
  }, [hideOverFlowBefore]);

  useEffect(() => {
    const anchors = document.querySelectorAll(
      'a[href^="#"]:not([data-enhanced])'
    );

    anchors.forEach((anchor) => {
      const rawHref = anchor.getAttribute("href")!;
      const targetId = `user-${rawHref.slice(1)}`;

      anchor.setAttribute("href", `#${targetId}`);
      anchor.setAttribute("data-enhanced", "true"); // prevent double-enhancing
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        document
          .getElementById(targetId)
          ?.scrollIntoView({ behavior: "smooth" });
      });
    });
  }, []);

  return null;
}
