import ButtonWithLoading from "@/components/ButtonWithLoading";
import Icon from "@/components/Icon";
import MiniLoadingSvg from "@/components/MiniLoadingSvg";
import TextInput from "@/components/TextInput";
import WrapperWithBottomLine from "@/components/WrapperWithBottomLine";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setCustomDomain, setDomainVerified } from "@/redux/slices/editorSlice";
import {
  checkVerificationStatusAction,
  requestCustomDomainAction,
  removeCustomDomainAction,
} from "@/utils/serverActions/customDomainActions";
import { useState } from "react";

const CustomDomain = () => {
  const domain = useAppSelector((state) => state.editor.customDomain || "");
  const [requestLoading, setRequestLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [records, setRecords] = useState<
    {
      domain: string;
      type: string;
      value: string;
      reason: string;
    }[]
  >([]);
  const [error, setError] = useState("");
  const id = useAppSelector((state) => state.editor.id);
  const status = useAppSelector((state) => state.editor.domainVerified);
  const dispatch = useAppDispatch();

  const handleRequest = async () => {
    if (!id) return setError("Something went wrong");
    setRequestLoading(true);
    setError("");
    setRecords([]);

    const { records, error } = await requestCustomDomainAction(id, domain);
    if (error) {
      setError(error);
    } else if (records) {
      setRecords(records);
      dispatch(setDomainVerified(false));
    }
    setRequestLoading(false);
  };

  return (
    <WrapperWithBottomLine>
      <TextInput
        title="Custom Domain"
        desc="Enter your custom domain here and request records to put to your DNS provider."
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
              dispatch(setDomainVerified(undefined));
              dispatch(setCustomDomain(""));
              setRecords([]);
            }

            setRemoveLoading(false);
          }}
          loading={removeLoading}
          text="Remove Domain"
        />
      </div>
      {status !== undefined && (
        <div className="flex justify-center items-center m-2 gap-4">
          <p className="text-sm text-center font-medium">
            <>
              Verification Status: {status ? "Verified" : "Pending"}
              {status === true && (
                <Icon
                  type="check-circle-fill"
                  size="20px"
                  title="Checkbox"
                  className="ms-2 text-positiveGreen"
                />
              )}
              {status === false && (
                <Icon
                  type="x-lg"
                  size="20px"
                  title="Checkbox"
                  className="ms-2 text-deleteRed"
                />
              )}
            </>
          </p>
          {status === false && (
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
                      await checkVerificationStatusAction(id);
                    if (error) {
                      setError(error);
                    } else if (status) {
                      dispatch(setDomainVerified(status));
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
                  <strong>Reason:</strong> {r.reason}
                </p>
                <div className="flex items-start justify-between gap-2">
                  <span>
                    <strong>Type:</strong> {r.type}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="break-all">
                    <strong>Name:</strong> {r.domain}
                  </span>
                  <button
                    className="text-xs text-blue-500 hover:underline"
                    onClick={() => copyToClipboard(r.domain)}
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
