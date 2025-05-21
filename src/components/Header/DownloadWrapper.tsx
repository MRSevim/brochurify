import {
  selectLayout,
  selectPageWise,
  selectVariables,
  useAppSelector,
} from "@/redux/hooks";
import Icon from "../Icon";
import { generateHTML } from "@/utils/HTMLGenerator";

const DownloadWrapper = () => {
  const layout = useAppSelector(selectLayout);
  const pageWise = useAppSelector(selectPageWise);
  const variables = useAppSelector(selectVariables);

  return (
    <>
      <Icon
        title="Download the html"
        type="download"
        size="24px"
        onClick={() => {
          const generatedHTML = generateHTML(
            layout,
            pageWise,
            variables,
            false
          );
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
    </>
  );
};

export default DownloadWrapper;
