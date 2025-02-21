"use client";
import Editor from "@/components/BuilderComponents/Editor";
import LeftPanel from "@/components/LeftPanel";
import RightPanel from "@/components/RightPanel";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { paste } from "@/redux/slices/editorSlice";

export default function Builder() {
  const [mounted, setMounted] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return <Loading />;

  return (
    <main
      className="overflow-x-hidden h-screen-header-excluded relative"
      onPaste={() => {
        dispatch(paste());
      }}
    >
      <Editor />
      <LeftPanel />
      <RightPanel />
    </main>
  );
}
