import { useAppSelector } from "@/redux/hooks";
import { useEffect, useRef } from "react";

export function ShadowContent({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<ShadowRoot | null>(null); // Save shadow root separately
  const globalTrigger = useAppSelector((state) => state.replay.globalTrigger);

  useEffect(() => {
    if (containerRef.current) {
      if (!shadowRef.current) {
        // Only attach shadow once
        shadowRef.current = containerRef.current.attachShadow({ mode: "open" });
      }
      const newHtml = html.replace(
        /<style[^>]*>([\s\S]*?)<\/style>/g,
        (match, cssContent) => {
          // First, find 'body' blocks and update line-height properties
          let modifiedCss = cssContent.replace(
            /body\s*{[^}]*}/g,
            (bodyBlock: string) => {
              return bodyBlock.replace(
                /line-height\s*:\s*([^;]+);/g,
                (lineMatch, value) => `line-height: ${value.trim()} !important;`
              );
            }
          );

          // Then replace 'body' selector with ':host'
          modifiedCss = modifiedCss.replace(/body/g, ":host");

          return `<style>${modifiedCss}</style>`;
        }
      );
      // Assign the modified HTML to the shadow root
      shadowRef.current.innerHTML = newHtml;
      // 👉 Run IntersectionObserver directly in Shadow DOM
      const elements = shadowRef.current.querySelectorAll(".element");
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scrolled");
            obs.unobserve(entry.target);
          }
        });
      });

      elements.forEach((el) => observer.observe(el));

      return () => {
        observer.disconnect();
      };
    }
  }, [html, globalTrigger]);

  return <div className="relative" ref={containerRef} />;
}
