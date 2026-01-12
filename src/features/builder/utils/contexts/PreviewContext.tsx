"use client";
import {
  SetStateAction,
  useContext,
  useState,
  createContext,
  useEffect,
} from "react";
import { LayoutToggleContext, SettingsToggleContext } from "./ToggleContext";
import { useViewModeSetter } from "./ViewModeContext";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setActive } from "../../lib/redux/slices/editorSlice";

const PreviewStateContext = createContext<boolean | undefined>(undefined);

const PreviewSetterContext = createContext<
  React.Dispatch<SetStateAction<boolean>> | undefined
>(undefined);

export const usePreviewState = () => {
  const value = useContext(PreviewStateContext);
  if (value === undefined)
    throw new Error("usePreviewState must be used inside provider");
  return value;
};

export const usePreviewSetter = () => {
  const setter = useContext(PreviewSetterContext);
  if (!setter) throw new Error("usePreviewSetter Must be used inside provider");
  return setter;
};

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [preview, setPreview] = useState(false);
  const setLayoutToggle = LayoutToggleContext.useSetToggle();
  const setSettingsToggle = SettingsToggleContext.useSetToggle();
  const setViewMode = useViewModeSetter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (preview) {
      setLayoutToggle(false);
      setSettingsToggle(false);
      document.body.style.overflow = "hidden";
    } else document.body.style.overflow = "";

    setViewMode("desktop");
    dispatch(setActive(undefined));
  }, [preview]);

  return (
    <PreviewStateContext.Provider value={preview}>
      <PreviewSetterContext.Provider value={setPreview}>
        {children}
      </PreviewSetterContext.Provider>
    </PreviewStateContext.Provider>
  );
};
