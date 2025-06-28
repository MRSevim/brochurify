import ButtonWithLoading from "@/components/ButtonWithLoading";
import Icon from "@/components/Icon";
import MiniLoadingSvg from "@/components/MiniLoadingSvg";
import TextInput from "@/components/TextInput";
import WrapperWithBottomLine from "@/components/WrapperWithBottomLine";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setCustomDomain,
  setVerificationStatus,
} from "@/redux/slices/editorSlice";
import { appConfig } from "@/utils/config";
import {
  checkCertificateStatusAction,
  getCertificateValidationRecordAction,
  removeCustomDomainAction,
  requestCertificateAction,
} from "@/utils/serverActions/customDomainActions";
import { useState } from "react";

const CustomDomain = () => {
  const domain = useAppSelector((state) => state.editor.customDomain || "");
  const [requestLoading, setRequestLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
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
  const status = useAppSelector((state) => state.editor.verificationStatus);
  const dispatch = useAppDispatch();

  const handleRequest = async () => {
    if (!id) return setError("Something went wrong");
    setRequestLoading(true);
    setError("");
    setRecords([]);

    const requestError = await requestCertificateAction(id, domain);
    if (requestError) {
      setRequestLoading(false);
      return setError(requestError);
    }

    const { records, error } = await getCertificateValidationRecordAction(id);
    if (error) {
      setError(error);
    } else if (records) {
      setRecords(records);
      dispatch(setVerificationStatus(appConfig.PENDING));
    }

    setRequestLoading(false);
  };

  return (
    <WrapperWithBottomLine>
      <TextInput
        title="Custom Domain"
        desc="Enter your custom domain here and request records to put to your DNS provider. If your provider does not support ANAME/ALIAS records for apex domains (eg. mydomain.com), use a domain with subdomain (eg. www.mydomain.com, app.mydomain.com) here and redirect your apex domain to your subdomain"
        value={domain}
        onChange={(e) => dispatch(setCustomDomain(e.target.value))}
      />
      <div className="m-2 flex gap-2 justify-center items-center">
        <ButtonWithLoading
          onClick={handleRequest}
          loading={requestLoading}
          text="Request Records"
        />
        <ButtonWithLoading
          type="red"
          onClick={async () => {
            if (!id) return setError("Something went wrong");
            setRemoveLoading(true);
            setError("");

            const error = await removeCustomDomainAction(id);
            if (error) {
              setError(error);
            } else {
              dispatch(setVerificationStatus(undefined));
              dispatch(setCustomDomain(""));
              setRecords([]);
            }

            setRemoveLoading(false);
          }}
          loading={removeLoading}
          text="Remove Domain"
        />
      </div>
      {status && (
        <div className="flex justify-center items-center m-2 gap-4">
          <p className="text-sm text-center font-medium">
            <>
              Verification Status: {status}
              {status === appConfig.VERIFIED && (
                <Icon
                  type="check-circle-fill"
                  size="20px"
                  title="Checkbox"
                  className="text-positiveGreen"
                />
              )}
            </>
          </p>
          {status !== appConfig.VERIFIED && (
            <>
              {refreshLoading ? (
                <MiniLoadingSvg />
              ) : (
                <Icon
                  type="arrow-clockwise"
                  size="20px"
                  title="Check Verification Status"
                  onClick={async () => {
                    if (!id) return setError("Something went wrong");
                    setRefreshLoading(true);
                    setError("");

                    const { status, error } =
                      await checkCertificateStatusAction(id);
                    if (error) {
                      setError(error);
                    } else if (status) {
                      dispatch(setVerificationStatus(status));
                    }

                    setRefreshLoading(false);
                  }}
                  className="rounded-full bg-text text-background p-2"
                />
              )}
            </>
          )}
        </div>
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
              <li key={i} className="p-3 rounded bg-muted border border-border">
                <p className="mb-1 text-xs text-muted-foreground">
                  <strong>Usage:</strong> {r.usage}
                </p>
                <div className="flex items-start justify-between gap-2">
                  <span>
                    <strong>Type:</strong> {r.type}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2">
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
                <div className="flex items-start justify-between gap-2">
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
    </WrapperWithBottomLine>
  );
};

export default CustomDomain;

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};
