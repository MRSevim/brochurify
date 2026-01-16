"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import TemplateViewer from "../../features/projects/components/TemplateViewer";
import { saveToLocalStorage } from "@/utils/Helpers";
import { createPortal } from "react-dom";

const Cta = () => {
  const [fresh, setFresh] = useState(false);
  const [popup, setPopup] = useState(false);
  const router = useRouter();
  return (
    <>
      <div className="flex gap-3 justify-center mt-3">
        <button
          className="p-4 bg-gray text-xl text-background rounded hover:scale-110"
          onClick={() => {
            const editorState = localStorage.getItem("editor");
            if (editorState) {
              setPopup(true);
            } else setFresh(true);
          }}
        >
          Go to Builder
        </button>
      </div>
      {popup && (
        <Popup onClickOutside={() => setPopup(false)}>
          <button
            className="p-4 bg-slate-400 text-l rounded"
            onClick={() => router.push("/builder")}
          >
            Keep working on local project
          </button>
          <button
            className="p-4 bg-amber text-l rounded"
            onClick={() => setFresh(true)}
          >
            Start from 0
          </button>
        </Popup>
      )}
      {fresh && (
        <TemplateViewer
          setAdding={setFresh}
          handleSelect={async (selectedTemplate: Record<string, any>) => {
            saveToLocalStorage({ ...selectedTemplate.editor });
            router.push("/builder");
          }}
          positiveActionText="Use"
        />
      )}
    </>
  );
};

const Popup = ({
  onClickOutside,
  children,
}: {
  onClickOutside: () => void;
  children: React.ReactNode;
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClickOutside();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [onClickOutside]);

  //creating portal since using fixed naked does not behave correctly
  return createPortal(
    <div
      ref={popupRef}
      className="fixed z-[99] top-[30%] left-1/2 -translate-x-1/2 w-[90%] bg-background border border-text text-black rounded p-5 shadow-md max-w-md flex gap-3"
    >
      {children}
    </div>,
    document.body
  );
};
export default Cta;
