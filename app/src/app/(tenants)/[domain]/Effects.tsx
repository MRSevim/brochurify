"use client";
import { runIntersectionObserver } from "@/utils/Helpers";
import { useEffect } from "react";

export default function Effects() {
  useEffect(() => {
    runIntersectionObserver(undefined);
  }, []);

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
