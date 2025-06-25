"use client";
import React, { useEffect, useState } from "react";
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
import { setPublished } from "@/redux/slices/editorSlice";
import { addNumberWithDash, slugify } from "@/utils/Helpers";
import AmberButtonWithLoading from "../AmberButtonWithLoading";

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
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!name) return;
      const get = async () => {
        setLoading(true);
        const safeName = slugify(name);
        if (!safeName) {
          setLength(0);
          toast.error(
            "Please enter a valid prefix. It should not be empty and include at least 1 number or letter."
          );
          return;
        }
        const { projects, error } = await scanPrefixAction(safeName);
        if (error) {
          toast.error(error);
        } else if (projects) {
          setLength(projects.length);
        }
        setLoading(false);
      };
      get();
    }, 300); // run only after 300ms pause

    return () => clearTimeout(timeout);
  }, [name]);

  return (
    <Popup
      onClose={() => setPublishPopup(false)}
      loading={publishLoading}
      onEditOrAdd={async () => {
        if (!id) return toast.error("Something went wrong");
        if (!slugify(name) && !published)
          return toast.error("Prefix cannot be empty");

        setPublishLoading(true);
        const error = await updateAction(type, id, {
          publish: {
            prefix: published ? undefined : slugify(name),
            published: !published,
            editor: published ? undefined : editor,
          },
        });
        if (error) {
          toast.error(error);
        } else {
          if (!published) {
            toast.success("Your project is successfully published");
          } else {
            toast.success("Your project is successfully unpublished");
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
              setLoading(true);
            }}
            desc="This prefix will show up in the url as subdomain. It has to be unique and url friendly or it will be altered by the app."
          />
          {loading && (
            <div className="flex justify-center items-center m-2">
              <MiniLoadingSvg />
            </div>
          )}
          {name && !loading && (
            <p className="text-center">
              Site will go live at{" "}
              <strong>
                {addNumberWithDash(slugify(name), length)}
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
          <AmberButtonWithLoading
            onClick={async () => {
              if (!id) return toast.error("Something went wrong");
              setPublishLoading(true);
              const error = await updateAction(type, id, {
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
    </Popup>
  );
};

export default PublishPopup;
