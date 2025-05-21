import React, { createContext, useContext, useRef } from "react";

const EditorRefContext =
  createContext<React.RefObject<HTMLDivElement | null> | null>(null);

export const useEditorRef = () => {
  const context = useContext(EditorRefContext);
  if (!context) {
    throw new Error("useEditorRef must be used within an EditorRefProvider");
  }
  return context;
};

export const EditorRefProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <EditorRefContext.Provider value={ref}>
      {children}
    </EditorRefContext.Provider>
  );
};
