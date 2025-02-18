"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAppSelector } from "@/redux/hooks";
import { generateHTML } from "@/utils/HTMLGenerator";
import { useEffect } from "react";

const page = () => {
  const layout = useAppSelector((state) => state.editor.layout);
  const pageWise = useAppSelector((state) => state.editor.pageWise);

  useEffect(() => {
    function ReplaceContent(param: string) {
      document.open();
      document.write(param);
      document.close();
    }
    const generatedHTML = generateHTML(layout, pageWise);
    ReplaceContent(generatedHTML);
  }, []);

  return (
    <div className="mt-10 flex justify-center items-center">
      <button className="p-2 bg-background text-text rounded flex items-center">
        <LoadingSpinner />
        Generating...
      </button>
    </div>
  );
};
export default page;
