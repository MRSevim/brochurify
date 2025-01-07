"use client";
import LeftPanel from "@/components/LeftPanel";
import RightPanel from "@/components/RightPanel";

export default function Builder() {
  return (
    <div className="overflow-x-hidden h-screen-header-excluded relative">
      <LeftPanel />
      <RightPanel />
    </div>
  );
}
