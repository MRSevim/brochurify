"use client";
import BuilderComp from "@/features/builder/components/BuilderComponents/Builder";
import Preview from "@/features/builder/components/Preview";
import { usePreviewState } from "@/features/builder/utils/contexts/PreviewContext";

export default function Builder() {
  const preview = usePreviewState();

  return (
    <main className="flex flex-1 overflow-hidden">
      {preview ? <Preview /> : <BuilderComp />}
    </main>
  );
}
