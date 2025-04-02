import Editor from "@/components/BuilderComponents/Editor";
import LeftPanel from "@/components/LeftPanel";
import RightPanel from "@/components/RightPanel";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { paste, redo, undo } from "@/redux/slices/editorSlice";

export default function Builder() {
  const [mounted, setMounted] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setMounted(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopImmediatePropagation();
      if (e.ctrlKey && e.key === "z") {
        dispatch(undo());
      } else if (e.ctrlKey && e.key === "y") {
        dispatch(redo());
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!mounted) return <Loading size={16} />;

  return (
    <div
      className="overflow-x-hidden h-screen-header-excluded relative"
      onPaste={() => {
        dispatch(paste());
      }}
    >
      <Editor />
      <LeftPanel />
      <RightPanel />
    </div>
  );
}
