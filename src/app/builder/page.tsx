"use client";
import Editor from "@/components/BuilderComponents/Editor";
import LeftPanel from "@/components/LeftPanel";
import RightPanel from "@/components/RightPanel";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";

export default function Builder() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return <Loading />;

  return (
    <div className="overflow-x-hidden h-screen-header-excluded relative">
      <Editor />
      <LeftPanel />
      <RightPanel />
    </div>
  );
}
