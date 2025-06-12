"use client";
import { useState } from "react";
import AddButton from "../AddButton";
import TemplateViewer from "./TemplateViewer";
import TextInput from "../TextInput";
import { createAction } from "@/utils/serverActions/projectActions";
import { toast } from "react-toastify";

const AddSection = () => {
  const [adding, setAdding] = useState(false);
  const [projectName, setProjectName] = useState("");

  const handleAdd = async (selectedTemplate: Record<string, any>) => {
    const { error } = await createAction({
      type: "project",
      title: projectName,
      editor: {
        layout: selectedTemplate?.editor.layout,
        pageWise: selectedTemplate?.editor.pageWise,
        variables: selectedTemplate?.editor.variables,
      },
      snapshot: selectedTemplate?.snapshot,
    });
    if (error) {
      toast.error(error);
    } else {
      setAdding(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h1 className="font-bold text-2xl">All Projects</h1>
        <AddButton onClick={() => setAdding((prev) => !prev)} colored />
        {adding && (
          <TemplateViewer setAdding={setAdding} handleSelect={handleAdd}>
            <TextInput
              title="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </TemplateViewer>
        )}
      </div>
    </>
  );
};

export default AddSection;
