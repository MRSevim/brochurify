import {
  selectLayout,
  selectPageWise,
  selectVariables,
  useAppSelector,
} from "@/redux/hooks";
import { generateHTML } from "@/utils/HTMLGenerator";
import { PreviewModal } from "./PreviewModal";

const Preview = () => {
  const layout = useAppSelector(selectLayout);
  const pageWise = useAppSelector(selectPageWise);
  const variables = useAppSelector(selectVariables);

  return <PreviewModal html={generateHTML(layout, pageWise, variables)} />;
};

export default Preview;
