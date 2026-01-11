import { getAllTemplatesAction } from "@/features/projects/utils/serverActions/projectActions";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Popup from "../../../components/Popup";
import { SnapshotImage } from "./SnapshotImage";
import Icon from "../../../components/Icon";
import { PreviewModal } from "../../builder/components/PreviewModal";
import { generateHTML } from "@/utils/HTMLGenerator";
import MiniLoadingSvg from "../../../components/MiniLoadingSvg";
import { usePreviewSetter } from "@/features/builder/utils/contexts/PreviewContext";

const TemplateViewer = ({
  positiveActionText,
  setAdding,
  handleSelect,
  children,
}: {
  positiveActionText?: string;
  setAdding: Dispatch<SetStateAction<boolean>>;
  handleSelect: (e: Record<string, any>) => Promise<void>;
  children?: React.ReactNode;
}) => {
  const [templates, setTemplates] = useState<Record<string, any>[] | null>(
    null
  );
  const setPreview = usePreviewSetter();
  const [getLoading, setGetLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [templateState, setInitialTemplate] = useState("Blank");
  const [previewing, setPreviewing] = useState<string | null>(null);
  const selectedTemplate = templates?.find((t) => t.title === templateState);
  const previewedTemplate = templates?.find((t) => t.title === previewing);

  useEffect(() => {
    const get = async () => {
      setGetLoading(true);
      const { templates, error } = await getAllTemplatesAction();
      if (error) {
        toast.error(error);
      } else if (templates) {
        setTemplates(templates);
      }
      setGetLoading(false);
    };
    get();
  }, []);

  return (
    <>
      <Popup
        positiveActionText={positiveActionText}
        loading={loading}
        className="max-w-5xl"
        editing={false}
        onClose={() => setAdding(false)}
        onEditOrAdd={async () => {
          setLoading(true);
          if (selectedTemplate) await handleSelect(selectedTemplate);
          setLoading(false);
        }}
      >
        {getLoading ? (
          <div className="p-2 flex justify-center">
            <MiniLoadingSvg />
          </div>
        ) : (
          <>
            <h2 className="font-bold text-lg mb-2">Choose a Template</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(0,300px))] max-h-80 overflow-auto gap-4 mb-2">
              {templates?.map((template) => (
                <div
                  onClick={() => setInitialTemplate(template.title)}
                  key={template.title}
                  className={`border rounded-lg p-2 cursor-pointer ${
                    templateState === template.title
                      ? "border-activeBlue"
                      : "border-gray hover:border-hoveredBlue"
                  }`}
                >
                  <SnapshotImage src={template.snapshot} alt={template.title} />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm">{template.title}</p>
                    <span className="hover:scale-125">
                      <Icon
                        title="preview"
                        type="eye-fill"
                        size="24px"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewing(template.title);
                          setPreview(true);
                        }}
                      />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {children}
      </Popup>
      {previewedTemplate && (
        <PreviewModal
          html={generateHTML(
            previewedTemplate.editor.layout,
            previewedTemplate.editor.pageWise,
            previewedTemplate.editor.variables
          )}
          onClose={() => {
            setPreviewing(null);
            setPreview(false);
          }}
          title={previewedTemplate.title}
        />
      )}
    </>
  );
};

export default TemplateViewer;
