"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { selectLayout, selectPageWise, useAppSelector } from "@/redux/hooks";
import { generateHTML } from "@/utils/HTMLGenerator";
import { useEffect } from "react";

const page = () => {
  const layout = useAppSelector(selectLayout);
  const pageWise = useAppSelector(selectPageWise);

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
