import {
  selectLayout,
  selectPageWise,
  selectVariables,
  useAppSelector,
} from "@/redux/hooks";
import { generateHTML } from "@/utils/HTMLGenerator";
import { FaDownload } from "react-icons/fa";

const DownloadWrapper = () => {
  const layout = useAppSelector(selectLayout);
  const pageWise = useAppSelector(selectPageWise);
  const variables = useAppSelector(selectVariables);

  return (
    <FaDownload
      className="text-[24px] cursor-pointer"
      title="Download the html"
      onClick={() => {
        const generatedHTML = generateHTML(layout, pageWise, variables);
        // Create a Blob from the HTML string
        const blob = new Blob([generatedHTML], { type: "text/html" });

        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);

        // Create an invisible anchor element and trigger the download
        const a = document.createElement("a");
        a.href = url;
        a.download = "website.html";
        document.body.appendChild(a);
        a.click();

        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }}
    />
  );
};

export default DownloadWrapper;
