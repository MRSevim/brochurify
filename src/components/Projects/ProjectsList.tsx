import { getAllAction } from "@/utils/serverActions/projectActions";
import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ShapshotImage } from "../ShapshotImage";
import TopBar from "./TopBar";
import { formatTime } from "@/utils/Helpers";

const ProjectsList = async () => {
  const { projects } = await getAllAction();

  if (!projects) {
    notFound();
  }
  if (!projects.length) {
    return <p className="font-bold text-l">No Projects</p>;
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-2">
      {projects.map((project) => (
        <div key={project.id} className="border rounded-lg p-2">
          <ShapshotImage src={project.snapshot} alt={project.title} />
          <div className="flex justify-between items-center mt-2">
            <TopBar project={project} />
          </div>
          <div className="flex flex-col justify-between items-center mt-2">
            <span className="rounded bg-background text-text p-2 hover:scale-110">
              <Link href={"/builder/" + project.id}>Build</Link>
            </span>
            <div className="flex flex-col text-xs mt-2 w-full">
              <div className="flex justify-between">
                <span>Created at:</span>
                <span className="font-bold">
                  {formatTime(project.createdAt)}
                </span>
              </div>
              {project.updatedAt && (
                <div className="flex justify-between">
                  <span>Updated at:</span>
                  <span className="font-bold">
                    {formatTime(project.updatedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsList;
