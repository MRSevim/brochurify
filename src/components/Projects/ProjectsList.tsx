import { getAllAction } from "@/utils/serverActions/projectActions";
import React from "react";
import { notFound } from "next/navigation";
import EditButton from "../EditButton";
import Link from "next/link";

const ProjectsList = async () => {
  const { projects, error } = await getAllAction();

  if (!projects) {
    notFound();
  }
  if (!projects.length) {
    return <p className="font-bold text-l">No Projects</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-4 mb-2">
      {projects.map((project) => (
        <div key={project.id} className="border rounded-lg p-2">
          {/*        <Image
            width={409}
            height={157}
            className="rounded w-full h-auto"
            src={template.image}
            alt={template.label}
          /> */}
          <div className="flex justify-between items-center mt-2">
            <p className="font-bold text-l">{project.title}</p>
            <Link href={"/builder/" + project.id}>
              <EditButton />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsList;
