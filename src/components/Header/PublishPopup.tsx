"use client";
import React, { useRef, useState } from "react";
import Popup from "../Popup";
import { usePublishPopup } from "@/features/builder/utils/contexts/PublishPopupContext";
import TextInput from "../TextInput";
import { appConfig } from "@/utils/config";
import { toast } from "react-toastify";
import {
  scanPrefixAction,
  updateAction,
} from "@/features/projects/utils/serverActions/projectActions";
import MiniLoadingSvg from "../MiniLoadingSvg";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  setDomainVerified,
  setPrefix,
  setPublished,
} from "@/features/builder/lib/redux/slices/editorSlice";
import { slugify } from "@/utils/Helpers";
import Link from "next/link";

let firstRequest = true;

const PublishPopup = () => {
  const [, setPublishPopup] = usePublishPopup();
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [scanLoading, setScanLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const type = useAppSelector((state) => state.editor.type);
  const id = useAppSelector((state) => state.editor.id);
  const published = useAppSelector((state) => state.editor.published);
  const editor = useAppSelector((state) => state.editor);
  const prefix = useAppSelector((state) => state.editor.prefix);
  const customDomain = useAppSelector((state) => state.editor.customDomain);
  const domainVerified = useAppSelector((state) => state.editor.domainVerified);
  const [slugified, setSlugified] = useState("");
  const latestNameRef = useRef(""); //this is here to prevent stale fetch updates

  return (
    <Popup
      onClose={() => setPublishPopup(false)}
      loading={publishLoading}
      onEditOrAdd={async () => {
        if (!id) return toast.error("Something went wrong");

        if (!slugified && !published)
          return toast.error("Prefix cannot be empty");

        setPublishLoading(true);
        const { error, prefix } = await updateAction(type, id, {
          publish: {
            prefix: published ? undefined : slugified,
            published: !published,
            editor: published ? undefined : editor,
          },
        });

        if (error) {
          toast.error(error);
        } else {
          if (!published) {
            toast.success("Your project is successfully published");
            if (prefix) {
              dispatch(setPrefix(prefix));
            }
          } else {
            toast.success("Your project is successfully unpublished");
            dispatch(setDomainVerified(undefined));
          }
          dispatch(setPublished(!published));
          setPublishPopup(false);
        }
        setPublishLoading(false);
      }}
      positiveActionText={published ? "Unpublish" : "Publish"}
    >
      {!published && (
        <>
          <TextInput
            title="Prefix"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              const value = e.target.value;
              latestNameRef.current = value; // track the most recent input
              setScanLoading(true);
              setTimeout(() => {
                if (!value) return;
                const get = async () => {
                  const safeName = slugify(value);
                  if (!safeName) {
                    if (latestNameRef.current !== value) return; // stale
                    toast.error(
                      "Please enter a valid prefix. It should not be empty and include at least 1 number or letter.",
                    );
                    setScanLoading(false);
                    return;
                  }

                  const { slugified, error } = await scanPrefixAction(safeName);

                  // Only update if this result is still the latest input
                  if (latestNameRef.current !== value) return;
                  if (error) {
                    toast.error(error);
                  } else if (slugified) {
                    setSlugified(slugified);
                  }
                  setScanLoading(false);
                };
                get();
              }, 300); // run only after 300ms pause
            }}
            desc="This prefix will show up in the url as subdomain. It has to be unique and url friendly or it will be altered by the app."
          />
          {scanLoading && (
            <div className="flex justify-center items-center m-2">
              <MiniLoadingSvg />
            </div>
          )}
          {slugified && !scanLoading && (
            <p className="text-center">
              Site will go live at{" "}
              <strong className="text-wrap break-all">
                {slugified}
                {appConfig.DOMAIN_EXTENSION}
              </strong>
              . You can also set custom domain in addition to this url from
              pagewise settings.
            </p>
          )}
        </>
      )}

      <div className="mt-4 px-4 text-xs text-muted-foreground italic max-w-4xl mx-auto">
        It can take up to 10 minutes for new changes to apply.
      </div>

      {(prefix || customDomain) && published && !publishLoading && (
        <div className="mt-2 text-s p-4">
          Your website is live at following domains:
          <ul className="font-bold list-none">
            {prefix && (
              <li>
                <Link
                  href={"https://" + prefix + appConfig.DOMAIN_EXTENSION}
                  target="_blank"
                >
                  {prefix}
                  {appConfig.DOMAIN_EXTENSION}
                </Link>
              </li>
            )}
            {customDomain && domainVerified && (
              <li>
                <Link href={"https://" + customDomain} target="_blank">
                  {customDomain}
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </Popup>
  );
};

export default PublishPopup;
