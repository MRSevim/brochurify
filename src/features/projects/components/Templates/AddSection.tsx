"use client";
import { useState } from "react";
import AddButton from "@/components/AddButton";
import Popup from "@/components/Popup";
import { getPageWise } from "@/utils/Helpers";
import TextInput from "@/components/TextInput";
import { createAction } from "@/features/projects/utils/serverActions/projectActions";
import { toast } from "react-toastify";

const AddSection = () => {
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [templateName, setTemplateName] = useState("");

  const handleAdd = async () => {
    setLoading(true);
    const { error } = await createAction({
      type: "template",
      title: templateName,
      editor: {
        layout: [],
        pageWise: getPageWise(),
        variables: [],
      },
    });
    if (error) {
      toast.error(error);
    } else {
      setAdding(false);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h1 className="font-bold text-2xl">All Templates</h1>
        <AddButton onClick={() => setAdding((prev) => !prev)} colored />
        {adding && (
          <Popup
            loading={loading}
            editing={false}
            onClose={() => setAdding(false)}
            onEditOrAdd={handleAdd}
          >
            <TextInput
              title="Template Name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </Popup>
        )}
      </div>
    </>
  );
};

export default AddSection;
