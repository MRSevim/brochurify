"use client";
import React, { useEffect } from "react";
import Builder from "../Builder";
import { useAppDispatch } from "@/redux/hooks";
import { hydrate } from "@/redux/slices/editorSlice";

const Wrapper = ({
  type = "project",
  project,
}: {
  type?: string;
  project: Record<string, any>;
}) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (project) {
      dispatch(hydrate({ type, id: project.id, ...project.editor }));
    }
  }, []);

  return <Builder />;
};

export default Wrapper;
