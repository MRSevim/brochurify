"use client";
import React, { useRef, useState } from "react";
import Popup from "../Popup";
import { usePublishPopup } from "@/contexts/PublishPopupContext";
import TextInput from "../TextInput";
import { appConfig } from "@/utils/config";
import { toast } from "react-toastify";
import {
  scanPrefixAction,
  updateAction,
} from "@/utils/serverActions/projectActions";
import MiniLoadingSvg from "../MiniLoadingSvg";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setDomainVerified,
  setPrefix,
  setPublished,
} from "@/redux/slices/editorSlice";
import { addNumberWithDash, slugify } from "@/utils/Helpers";
import ButtonWithLoading from "../ButtonWithLoading";
import Link from "next/link";

const PublishPopup = () => {
  const [, setPublishPopup] = usePublishPopup();
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [length, setLength] = useState(0);
  const type = useAppSelector((state) => state.editor.type);
  const id = useAppSelector((state) => state.editor.id);
  const published = useAppSelector((state) => state.editor.published);
  const editor = useAppSelector((state) => state.editor);
  const prefix = useAppSelector((state) => state.editor.prefix);
  const customDomain = useAppSelector((state) => state.editor.customDomain);
  const domainVerified = useAppSelector((state) => state.editor.domainVerified);
  const slugified = addNumberWithDash(slugify(name), length);
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
              setLoading(true);
              setTimeout(() => {
                if (!value) return;
                const get = async () => {
                  const safeName = slugify(value);
                  if (!safeName) {
                    if (latestNameRef.current !== value) return; // stale
                    setLength(0);
                    toast.error(
                      "Please enter a valid prefix. It should not be empty and include at least 1 number or letter."
                    );
                    return;
                  }
                  const { projects, error } = await scanPrefixAction(safeName);

                  // Only update if this result is still the latest input
                  if (latestNameRef.current !== value) return;

                  if (error) {
                    toast.error(error);
                  } else if (projects) {
                    setLength(projects.length);
                  }
                  setLoading(false);
                };
                get();
              }, 300); // run only after 300ms pause
            }}
            desc="This prefix will show up in the url as subdomain. It has to be unique and url friendly or it will be altered by the app."
          />
          {loading && (
            <div className="flex justify-center items-center m-2">
              <MiniLoadingSvg />
            </div>
          )}
          {slugified && !loading && (
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
      {published && (
        <div className="flex justify-center items-center m-2 mb-5">
          <ButtonWithLoading
            onClick={async () => {
              if (!id) return toast.error("Something went wrong");
              setPublishLoading(true);
              const { error } = await updateAction(type, id, {
                publish: {
                  editor,
                  published: true,
                },
              });
              if (error) {
                toast.error(error);
              } else {
                toast.success("Your project is successfully republished");
                setPublishPopup(false);
              }
              setPublishLoading(false);
            }}
            text="Republish Latest Changes"
            loading={publishLoading}
          />
        </div>
      )}
      <div className="mt-4 px-4 text-xs text-muted-foreground italic max-w-4xl mx-auto">
        *It can take up to 10 minutes for new changes to apply.
      </div>
      {!loading && (
        <>
          {(prefix || customDomain) && published && (
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
        </>
      )}
    </Popup>
  );
};

export default PublishPopup;
