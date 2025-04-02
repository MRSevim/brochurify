"use client";

import { usePreview } from "@/contexts/PreviewContext";
import BuilderComp from "@/components/BuilderComponents/Builder";
import Preview from "@/components/Preview";

export default function Builder() {
  const [preview] = usePreview();

  return (
    <main className="h-screen">{preview ? <Preview /> : <BuilderComp />}</main>
  );
}
