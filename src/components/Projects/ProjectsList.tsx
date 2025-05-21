import { getAllAction } from "@/utils/serverActions/projectActions";
import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ShapshotImage } from "../ShapshotImage";
import TopBar from "./TopBar";

const ProjectsList = async () => {
  const { projects } = await getAllAction();

  if (!projects) {
    notFound();
  }
  if (!projects.length) {
    return <p className="font-bold text-l">No Projects</p>;
  }
  return (
    <div className="grid grid-cols-4 gap-4 mb-2">
      {projects.map((project) => (
        <div key={project.id} className="border rounded-lg p-2">
          <ShapshotImage src={project.snapshot} alt={project.title} />
          <div className="flex justify-between items-center mt-2">
            <TopBar project={project} />
          </div>
          <div className="flex justify-center items-center mt-2">
            <span className="rounded bg-background text-text p-2 hover:scale-110">
              <Link href={"/builder/" + project.id}>Build</Link>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsList;
