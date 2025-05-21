"use client";
import React, { useEffect } from "react";
import Builder from "../Builder";
import { useAppDispatch } from "@/redux/hooks";
import { hydrate } from "@/redux/slices/editorSlice";

const Wrapper = ({ project }: { project: Record<string, any> }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (project) {
      dispatch(hydrate({ id: project.id, ...project.data }));
    }
  }, [project]);

  return <Builder />;
};

export default Wrapper;
