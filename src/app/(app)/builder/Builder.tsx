"use client";
import BuilderComp from "@/features/builder/components/BuilderComponents/Builder";
import Preview from "@/features/builder/components/Preview";
import { useEffect } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setActive } from "@/features/builder/lib/redux/slices/editorSlice";
import { usePreviewState } from "@/features/builder/utils/contexts/PreviewContext";

export default function Builder() {
  const preview = usePreviewState();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setActive(undefined));
  }, [preview]);

  return (
    <main className="flex flex-1 overflow-hidden">
      {preview ? <Preview /> : <BuilderComp />}
    </main>
  );
}
