"use client";
import { useAppDispatch } from "@/redux/hooks";
import Builder from "./Builder";
import { hydrateLocal } from "@/redux/slices/editorSlice";
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
