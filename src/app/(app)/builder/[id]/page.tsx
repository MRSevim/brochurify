import { notFound } from "next/navigation";
import { getProjectAction } from "@/utils/serverActions/projectActions";
import Wrapper from "./Wrapper";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectAction("project", id);
  if (!project) {
    notFound();
  }

  return <Wrapper project={project} />;
}
