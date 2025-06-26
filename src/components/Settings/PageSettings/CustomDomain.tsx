import AmberButtonWithLoading from "@/components/AmberButtonWithLoading";
import MiniLoadingSvg from "@/components/MiniLoadingSvg";
import TextInput from "@/components/TextInput";
import WrapperWithBottomLine from "@/components/WrapperWithBottomLine";
import { useAppSelector } from "@/redux/hooks";
import {
  checkCertificateStatusAction,
  getCertificateValidationRecordAction,
  requestCertificateAction,
} from "@/utils/serverActions/customDomainActions";
import { getProjectAction } from "@/utils/serverActions/projectActions";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const CustomDomain = () => {
  const [domain, setDomain] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [getDomainLoading, setGetDomainLoading] = useState(true);
  const [records, setRecords] = useState<
    {
      name: string;
      type: string;
      value: string;
      usage: string;
    }[]
  >([]);
  const [error, setError] = useState("");
  const id = useAppSelector((state) => state.editor.id);
  const type = useAppSelector((state) => state.editor.type);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const get = async () => {
      if (!id) {
        setGetDomainLoading(false);
        return setError("Something went wrong");
      }
      const project = await getProjectAction(type, id);
      if (project) {
        if (project.customDomain) {
          setDomain(project.customDomain);
        }
        if (project.certificateStatus === "ISSUED") {
          setGetDomainLoading(false);
          return setStatus("ISSUED");
        } else if (!project.customDomain) {
          return setGetDomainLoading(false);
        }

        const { status, error } = await checkCertificateStatusAction(id);
        if (status) {
          if (status !== "ISSUED") {
            const { records, error } =
              await getCertificateValidationRecordAction(id);
            if (error) {
              setError(error);
            } else if (records) {
              setRecords(records);
            }
          }
          setStatus(status);
        } else if (error) {
          toast.error(error);
        }
      } else {
        toast.error("Project not found");
      }
      setGetDomainLoading(false);
    };
    get();
  }, []);

  const handleRequest = async () => {
    if (!id) return setError("Something went wrong");
    setRequestLoading(true);
    setError("");
    setRecords([]);

    const requestError = await requestCertificateAction(id, domain);
    if (requestError) {
      return setError(requestError);
    }

    const { records, error } = await getCertificateValidationRecordAction(id);
    if (error) {
      setError(error);
    } else if (records) {
      setRecords(records);
    }

    setRequestLoading(false);
  };

  return (
    <WrapperWithBottomLine>
      {getDomainLoading && (
        <div className="text-text flex items-center justify-center m-2">
          <MiniLoadingSvg />
        </div>
      )}
      {!getDomainLoading && (
        <>
          <TextInput
            title="Custom Domain"
            desc="Enter your custom domain here and request records to put to your DNS provider"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
          <div className="m-2 flex justify-center items-center">
            <AmberButtonWithLoading
              onClick={handleRequest}
              loading={requestLoading}
              text="Request Records"
            />
          </div>
          {status && (
            <p className="text-sm text-center font-medium mt-2">
              Certificate Status: {status}
            </p>
          )}

          {error && (
            <p className="text-sm text-red-500 text-center font-medium mt-2">
              {error}
            </p>
          )}
          {records.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2 text-sm">
                Add these DNS records to your provider:
              </h4>
              <ul className="text-sm text-left space-y-4">
                {records.map((r, i) => (
                  <li
                    key={i}
                    className="p-3 rounded bg-muted border border-border"
                  >
                    <p className="mb-1 text-xs text-muted-foreground">
                      <strong>Usage:</strong> {r.usage}
                    </p>
                    <div className="flex items-start justify-between gap-2">
                      <span>
                        <strong>Type:</strong> {r.type}
                      </span>
                      <button
                        className="text-xs text-blue-500 hover:underline"
                        onClick={() => copyToClipboard(r.type)}
                      >
                        Copy
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="break-all">
                        <strong>Name:</strong> {r.name}
                      </span>
                      <button
                        className="text-xs text-blue-500 hover:underline"
                        onClick={() => copyToClipboard(r.name)}
                      >
                        Copy
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="break-all">
                        <strong>Value:</strong> {r.value}
                      </span>
                      <button
                        className="text-xs text-blue-500 hover:underline"
                        onClick={() => copyToClipboard(r.value)}
                      >
                        Copy
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </WrapperWithBottomLine>
  );
};

export default CustomDomain;

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};
