import Checkbox from "@/components/Checkbox";
import ColorPicker from "@/components/ColorPicker";
import FontFamilyPicker from "@/components/FontFamilyPicker";
import LinkInput from "@/components/LinkInput";
import Slider from "@/components/Slider";
import { selectPageWise, useAppSelector } from "@/redux/hooks";
import { Style, CONFIG, PageWise } from "@/utils/Types";
import { Editor } from "@tiptap/react";
import { Dispatch, useEffect } from "react";

const getFontSize = (editor: Editor, pageWise: PageWise) => {
  const { state } = editor;
  const { $from } = state.selection;

  const parentNode = $from.node($from.depth); // Get the block-level parent node
  const nodeType = parentNode.type.name;

  let tag = nodeType;

  // For headings, convert "heading" + level to "h1", "h2", etc.
  if (nodeType === "heading") {
    tag = `h${parentNode.attrs.level}`;
  }
  const sizedHeadingTags = ["h1", "h2", "h3"];
  return (
    editor.getAttributes("textStyle").fontSize ||
    (sizedHeadingTags.includes(tag)
      ? (pageWise[tag] as Style)?.["font-size"] || "16px"
      : pageWise["font-size"] || "16px")
  );
};

const getFontFamily = (editor: Editor, pageWise: PageWise) => {
  const selectedFontFamily = editor
    .getAttributes("textStyle")
    .fontFamily?.includes('"')
    ? editor.getAttributes("textStyle").fontFamily?.replace(/"/g, "'")
    : editor.isActive("heading")
    ? pageWise[CONFIG.headings]?.["font-family"]
    : pageWise["font-family"] || "inherit";

  return selectedFontFamily;
};
const getColor = (editor: Editor, pageWise: PageWise) =>
  editor.getAttributes("textStyle").color || pageWise.color || "#000000";

const getLinkAttr = (editor: Editor) => editor.getAttributes("link");

const getLineHeight = (editor: Editor, pageWise: PageWise) =>
  editor.getAttributes("textStyle").lineHeight ||
  pageWise["line-height"] ||
  "1.5";

const getLetterSpacing = (editor: Editor) =>
  editor.getAttributes("textStyle").letterSpacing || "0px";

const Popup = ({
  type,
  editor,
  state,
  setState,
  children,
}: {
  type: string;
  editor: Editor;
  state: any;
  setState: Dispatch<any>;
  children: React.ReactNode;
}) => {
  const pageWise = useAppSelector(selectPageWise);
  const color = getColor(editor, pageWise);
  const fontFamily = getFontFamily(editor, pageWise);
  const fontSize = getFontSize(editor, pageWise);
  const linkAttr = getLinkAttr(editor);
  const lineHeight = getLineHeight(editor, pageWise);
  const letterSpacing = getLetterSpacing(editor);

  useEffect(() => {
    if (type === "color") {
      setState(color);
    } else if (type === "font-family") {
      setState(fontFamily);
    } else if (type === "font-size") {
      setState(fontSize);
    } else if (type === "link") {
      setState(linkAttr);
    } else if (type === "line-height") {
      setState(lineHeight);
    } else if (type === "letter-spacing") {
      setState(letterSpacing);
    }
  }, []);

  return (
    <div className="absolute z-10 bg-background border border-text rounded p-3 top-5 w-full">
      {type === "color" && (
        <ColorPicker
          title="Pick a color"
          selected={state || color}
          onChange={(e) => {
            setState(e);
          }}
        />
      )}
      {type === "font-family" && (
        <FontFamilyPicker
          variable={state || fontFamily}
          onChange={(e) => {
            setState(e);
          }}
        />
      )}
      {type === "font-size" && (
        <Slider
          title="Pick font size value"
          step={1}
          value={state || fontSize}
          onChange={(e) => {
            setState(e);
          }}
        />
      )}
      {type === "link" && (
        <Link
          linkAttr={state || linkAttr}
          onInputChange={(link: string, newtab: boolean) => {
            setState({
              href: link,
              target: newtab ? "_blank" : "_self",
            });
          }}
        />
      )}
      {type === "line-height" && (
        <Slider
          units={["", "px", "em", "%"]}
          title="Pick line-height value"
          min={1}
          max={5}
          step={0.5}
          value={state || lineHeight}
          onChange={(e) => {
            setState(e);
          }}
        />
      )}
      {type === "letter-spacing" && (
        <Slider
          letterSpacing={true}
          title="Pick letter spacing value"
          units={["px", "em"]}
          step={1}
          value={state || letterSpacing}
          onChange={(e) => {
            setState(e);
          }}
        />
      )}
      {children}
    </div>
  );
};

const Link = ({
  linkAttr,
  onInputChange,
}: {
  linkAttr: Record<string, any>;
  onInputChange: (link: string, newtab: boolean) => void;
}) => {
  const newtab = linkAttr.target === "_blank";
  const link = linkAttr.href || "";

  const handleInputChange = (link: string, newtab: boolean) => {
    onInputChange(link, newtab);
  };
  return (
    <>
      <LinkInput
        title="Enter the link"
        value={link}
        onChange={(e) => {
          handleInputChange(e.target.value, newtab);
        }}
      />
      <Checkbox
        title="Open in new tab"
        checked={newtab}
        onChange={(e) => {
          handleInputChange(link, e.target.checked);
        }}
      />
    </>
  );
};

export default Popup;
