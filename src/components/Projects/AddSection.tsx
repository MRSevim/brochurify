"use client";
import { useState } from "react";
import AddButton from "../AddButton";
import Popup from "../Popup";
import Icon from "../Icon";
import { generateHTML } from "@/utils/HTMLGenerator";
import { getPageWise } from "@/utils/Helpers";
import { ShadowContent } from "../ShadowContent";
import { Modal } from "../Modal";
import { initialSimpleLayout } from "@/utils/InitialLayout";
import Image from "next/image";
import TextInput from "../TextInput";
import { createAction } from "@/utils/serverActions/projectActions";
import { toast } from "react-toastify";

export const templateOptions = [
  {
    label: "Blank",
    value: "blank",
    image: "/template-previews/blank.png",
    layout: [],
    pageWise: getPageWise(),
    variables: [],
  },
  {
    label: "Simple Display",
    value: "simple",
    image: "/template-previews/simple.png",
    layout: initialSimpleLayout,
    pageWise: getPageWise(),
    variables: [],
  },
];

const AddSection = () => {
  const [adding, setAdding] = useState(false);
  const [initialTemplate, setInitialTemplate] = useState("blank");
  const [previewing, setPreviewing] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const selectedTemplate = templateOptions.find((t) => t.value === previewing);

  const handleAdd = async () => {
    /* const { error } = await createAction({
      title: projectName,
      editor: {
        layout: selectedTemplate?.layout,
        pageWise: selectedTemplate?.pageWise,
        variables: selectedTemplate?.variables,
        history: [],
      },
    });
    if (error) toast.error(error); */
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl">All Projects</h1>
        <AddButton onClick={() => setAdding((prev) => !prev)} colored />
        {adding && (
          <Popup
            maxWidth="4xl"
            editing={false}
            onClose={() => setAdding(false)}
            onEditOrAdd={handleAdd}
          >
            <h2 className="font-bold text-lg mb-2">Choose a Template</h2>
            <div className="grid grid-cols-2 gap-4 mb-2">
              {templateOptions.map((template) => (
                <div
                  key={template.value}
                  className={`border rounded-lg p-2 cursor-pointer ${
                    initialTemplate === template.value
                      ? "border-text"
                      : "border-gray"
                  }`}
                >
                  <Image
                    width={409}
                    height={157}
                    onClick={() => setInitialTemplate(template.value)}
                    className="rounded w-full h-auto"
                    src={template.image}
                    alt={template.label}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm">{template.label}</p>
                    <span className="hover:scale-125">
                      <Icon
                        title="preview"
                        type="eye-fill"
                        size="24px"
                        onClick={() => setPreviewing(template.value)}
                      />
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <TextInput
              title="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </Popup>
        )}
      </div>
      {previewing && selectedTemplate && (
        <Modal
          onClose={() => setPreviewing(null)}
          title={selectedTemplate.label}
        >
          <ShadowContent
            html={generateHTML(
              selectedTemplate.layout,
              selectedTemplate.pageWise,
              selectedTemplate.variables,
              true
            )}
          />
        </Modal>
      )}
    </>
  );
};

export default AddSection;
