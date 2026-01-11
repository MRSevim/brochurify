import React from "react";

interface Props {
  toggle: boolean;
  from: "left" | "right";
  zIndex: string;
  children: React.ReactNode;
}

const PanelWrapper = ({ toggle, from, children, zIndex }: Props) => {
  const translateString =
    from === "left" ? "-translate-x-full" : "translate-x-full";

  return (
    <section
      className={
        "bg-background w-screen h-full flex flex-col transition-transform sm:w-96 absolute top-0 " +
        (from === "right" ? " right-0 " : "") +
        (!toggle ? translateString : "")
      }
      style={{ zIndex }}
    >
      {children}
    </section>
  );
};

export default PanelWrapper;
