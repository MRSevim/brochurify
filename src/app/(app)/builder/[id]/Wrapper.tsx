"use client";
import React, { useEffect } from "react";
import Builder from "../Builder";
import { useAppDispatch } from "@/lib/redux/hooks";
import { hydrate } from "@/features/builder/lib/redux/slices/editorSlice";

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
      dispatch(
        hydrate({
          type,
          id: project.id,
          published: project.published,
          domainVerified: project.domainVerified,
          customDomain: project.customDomain,
          prefix: project.prefix,
          ...project.editor,
        })
      );
    }
  }, []);

  return <Builder />;
};

export default Wrapper;
