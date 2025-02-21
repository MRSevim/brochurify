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
      const getHTMLContent = (htmlString: string): string => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");

        // You can access the body, head, or any other part here
        return doc.documentElement.innerHTML; // This gets everything inside the <html> tag
      };

      const htmlDom = document?.querySelector("html");
      if (htmlDom) {
        htmlDom.removeAttribute("class");
        htmlDom.innerHTML = getHTMLContent(param);
      }
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
