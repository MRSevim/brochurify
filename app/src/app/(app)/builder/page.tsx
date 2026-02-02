"use client";
import { useAppDispatch } from "@/lib/redux/hooks";
import Builder from "./Builder";
import { hydrateLocal } from "@/features/builder/lib/redux/slices/editorSlice";
import { useEffect } from "react";

export default function page() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const editorState = localStorage.getItem("editor");
    if (editorState) {
      const editorStateParsed = JSON.parse(editorState);
      dispatch(hydrateLocal(editorStateParsed));
    }
  }, []);

  return <Builder />;
}
