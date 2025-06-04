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
  hydrateForcingSave,
  redo,
  setActive,
  undo,
} from "@/redux/slices/editorSlice";
import SavePopupWrapper from "./SavePopupWrapper";
import Link from "next/link";
import { triggerReplay } from "@/redux/slices/replaySlice";
import DownloadWrapper from "./DownloadWrapper";
import { usePathname } from "next/navigation";
import Container from "../Container";
import ViewMode from "./ViewMode";
import { usePreview } from "@/contexts/PreviewContext";
import ZoomView from "./ZoomView";
import UserMenu from "./UserMenu";
import { useUser } from "@/contexts/UserContext";
import { toast } from "react-toastify";

const Header = () => {
  const pathname = usePathname();
  const isBuilder = pathname.startsWith("/builder");

  return (
    <header className="w-full bg-background">
      <Container pushedVertically={false}>
        <TopHeader isBuilder={isBuilder} />
        {isBuilder && <BuilderHeader />}
      </Container>
    </header>
  );
};

const TopHeader = ({ isBuilder }: { isBuilder: boolean }) => {
  const [preview, setPreview] = usePreview();
  const [user] = useUser();
  const projectId = useAppSelector(selectProjectId);
  const showPublish = user && projectId;
  return (
    <div className="flex justify-center sm:justify-between items-center py-2 flex-wrap ">
      <Link href="/">
        <p className="font-bold text-lg">Brochurify</p>
      </Link>
      {preview && isBuilder && "You are in preview mode"}
      <div className="flex gap-4 items-center">
        <DarkModeToggle />
        {!isBuilder ? (
          <>
            <Link href="/contact">
              <span>Contact</span>
            </Link>
            <Link href="/about">
              <span>About</span>
            </Link>
            <UserMenu />
          </>
        ) : (
          <>
            <Icon
              title={preview ? "Back to builder" : "Preview the page"}
              type={preview ? "backspace-fill" : "eye-fill"}
              size="24px"
              onClick={() => {
                setPreview((prev) => !prev);
              }}
            />
            {showPublish && (
              <button className="p-2 rounded bg-amber text-black">
                Publish
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const BuilderHeader = () => {
  const [preview] = usePreview();

  return (
    <div className="flex justify-between items-center">
      <div className={preview ? "invisible" : ""}>
        <LeftSide />
      </div>
      <Center />
      <div className={preview ? "invisible" : ""}>
        <RightSide />
      </div>
    </div>
  );
};

const Center = () => {
  const dispatch = useAppDispatch();
  const [preview] = usePreview();

  return (
    <div className="flex items-center justify-between flex-1 flex-col md:flex-row">
      <div
        className={
          "ms-6 flex items-center gap-2 " + (preview ? "invisible" : "")
        }
      >
        <LeftSideActions />
        <SavePopupWrapper />
      </div>

      <div className="me-8 flex items-center gap-2">
        <Icon
          title="Replay"
          type="play-circle"
          size="24px"
          onClick={() => dispatch(triggerReplay())}
        />
        <ViewMode />
        <ZoomView />
      </div>
    </div>
  );
};

const LeftSide = () => {
  const [, setLayoutToggle] = LayoutToggleContext.Use();

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
  const [, setSettingsToggle] = SettingsToggleContext.Use();
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
          type="floppy"
          size="24px"
          onClick={() => {
            const editorState = localStorage.getItem("editor");
            if (editorState) {
              const editorStateParsed = JSON.parse(editorState);
              dispatch(hydrateForcingSave(editorStateParsed));
            } else toast.error("You have no local editor state saved");
          }}
        />
      )}
    </>
  );
};

const RightSide = () => {
  const [, setSettingsToggle] = SettingsToggleContext.Use();
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
