import Editor from "@/components/BuilderComponents/Editor";
import LeftPanel from "../LeftPanel/LeftPanel";
import RightPanel from "@/features/builder/components/RightPanel";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";

export default function Builder() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Loading size={50} />;

  return (
    <div className="w-full relative overflow-hidden">
      <Editor />
      <LeftPanel />
      <RightPanel />
    </div>
  );
}
