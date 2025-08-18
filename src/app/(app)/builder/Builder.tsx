"use client";
import BuilderComp from "@/components/BuilderComponents/Builder";
import Preview from "@/components/Preview";
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setActive } from "@/redux/slices/editorSlice";
import { usePreviewState } from "@/contexts/PreviewContext";

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
