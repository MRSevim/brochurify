"use client";
import {
  selectActive,
  selectProjectId,
  useAppDispatch,
  useAppSelector,
} from "@/redux/hooks";
import DarkModeToggle from "../DarkModeToggle";
import Icon from "../Icon";
import {
  LayoutToggleContext,
  SettingsToggleContext,
} from "@/contexts/ToggleContext";
import {
  redo,
  setActive,
  setFromLocal,
  undo,
} from "@/redux/slices/editorSlice";
import SavePopupWrapper from "./SavePopupWrapper";
import Link from "next/link";
import { triggerReplay } from "@/redux/slices/replaySlice";
import DownloadWrapper from "./DownloadWrapper";
import { usePathname } from "next/navigation";
import Container from "../Container";
import ViewMode from "./ViewMode";
import ZoomView from "./ZoomView";
import UserMenu from "./UserMenu";
import { useUser } from "@/contexts/UserContext";
import { toast } from "react-toastify";
import { usePreviewSetter, usePreviewState } from "@/contexts/PreviewContext";
import PublishPopup from "./PublishPopup";
import { usePublishPopup } from "@/contexts/PublishPopupContext";

const Header = () => {
  const pathname = usePathname();
  const isBuilder = pathname.startsWith("/builder");

  return (
    <header className="w-full bg-background">
      <Container pushedVertically={false} addBottomMargin={false}>
        <TopHeader isBuilder={isBuilder} />
        {isBuilder && <BuilderHeader />}
      </Container>
    </header>
  );
};

const TopHeader = ({ isBuilder }: { isBuilder: boolean }) => {
  const [user] = useUser();
  const preview = usePreviewState();
  const setPreview = usePreviewSetter();
  const isTemplate =
    useAppSelector((state) => state.editor.type) === "template";
  const projectId = useAppSelector(selectProjectId);
  const showPublish = user && projectId && !isTemplate;
  const [publishPopup, setPublishPopup] = usePublishPopup();
  const published = useAppSelector((state) => state.editor.published);
  return (
    <div className="flex flex-col justify-center md:justify-between md:flex-row items-center py-2 flex-wrap ">
      <Link href="/">
        <p className="font-bold text-lg">Brochurify</p>
      </Link>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <DarkModeToggle />
        {!isBuilder ? (
          <div className="flex gap-4 items-center">
            <Link href="/contact">
              <span>Contact</span>
            </Link>
            <Link href="/about">
              <span>About</span>
            </Link>
            <UserMenu />
          </div>
        ) : (
          <div className="flex gap-4 items-center">
            <Icon
              title={preview ? "Back to builder" : "Preview the page"}
              type={preview ? "backspace-fill" : "eye-fill"}
              size="24px"
              onClick={() => {
                setPreview((prev) => !prev);
              }}
            />
            {showPublish && (
              <>
                <button
                  className="p-2 rounded bg-amber text-black"
                  onClick={() => setPublishPopup(true)}
                >
                  {published ? "Republish/Unpublish" : "Publish"}
                </button>
                {publishPopup && <PublishPopup />}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const BuilderHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <LeftSide />
      <Center />
      <RightSide />
    </div>
  );
};

const Center = () => {
  return (
    <div className="flex items-center justify-between flex-1 flex-col md:flex-row">
      <div className="ms-6 flex items-center gap-2">
        <LeftSideActions />
        <SavePopupWrapper />
      </div>

      <div className="me-8">
        <ViewActions>
          <ZoomView />
        </ViewActions>
      </div>
    </div>
  );
};

export const ViewActions = ({ children }: { children?: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex items-center gap-2">
      <Icon
        title="Replay"
        type="play-circle"
        size="24px"
        onClick={() => dispatch(triggerReplay())}
      />
      <ViewMode />
      {children && children}
    </div>
  );
};

const LeftSide = () => {
  const setLayoutToggle = LayoutToggleContext.useSetToggle();

  return (
    <Icon
      title="Layout"
      type="list-nested"
      size="28px"
      onClick={() => setLayoutToggle((prev) => !prev)}
    />
  );
};

const LeftSideActions = () => {
  const dispatch = useAppDispatch();
  const active = useAppSelector(selectActive);
  const setSettingsToggle = SettingsToggleContext.useSetToggle();
  const [user] = useUser();
  const projectId = useAppSelector(selectProjectId);
  const showImport = user && projectId;
  return (
    <>
      <Icon
        title="Undo"
        type="arrow-counterclockwise"
        size="24px"
        onClick={() => dispatch(undo())}
      />
      <Icon
        title="Redo"
        type="arrow-clockwise"
        size="24px"
        onClick={() => dispatch(redo())}
      />
      <Icon
        title="Pagewise settings"
        type="globe"
        size="24px"
        onClick={() => {
          if (!active) {
            setSettingsToggle((prev) => !prev);
          } else {
            setSettingsToggle(true);
          }
          dispatch(setActive(undefined));
        }}
      />
      <DownloadWrapper />
      {showImport && (
        <Icon
          title="Import locally saved work"
          type="download"
          size="24px"
          onClick={() => {
            const editorState = localStorage.getItem("editor");
            if (editorState) {
              const editorStateParsed = JSON.parse(editorState);
              dispatch(setFromLocal(editorStateParsed));
            } else toast.error("You have no local editor state saved");
          }}
        />
      )}
    </>
  );
};

const RightSide = () => {
  const setSettingsToggle = SettingsToggleContext.useSetToggle();
  return (
    <Icon
      title="Settings"
      type="gear-fill"
      size="24px"
      onClick={() => {
        setSettingsToggle((prev) => !prev);
      }}
    />
  );
};

export default Header;
