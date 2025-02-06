import React from "react";

interface Props {
  toggle: boolean;
  from: "left" | "right";
  children: React.ReactNode;
}

const PanelWrapper = ({ toggle, from, children }: Props) => {
  const translateString =
    from === "left" ? "-translate-x-full" : "translate-x-full";

  return (
    <section
      className={
        "bg-dark border-light w-screen h-screen-header-excluded transition-transform sm:w-96 absolute top-0 text-light " +
        (from === "right" ? " right-0 border-l-4 " : " border-r-4 ") +
        (!toggle ? translateString : "")
      }
    >
      {children}
    </section>
  );
};

export default PanelWrapper;
