import Checkbox from "@/components/Checkbox";
import ColorPicker from "@/components/ColorPicker";
import LinkInput from "@/components/LinkInput";
import Select from "@/components/Select";
import Slider from "@/components/Slider";
import { selectPageWise, useAppSelector } from "@/redux/hooks";
import { defaultInheritFontOptions, getFontVariables } from "@/utils/Helpers";
import { Style, CONFIG } from "@/utils/Types";
import { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";

const Popup = ({
  type,
  editor,
  children,
}: {
  type: string;
  editor: Editor;
  children: React.ReactNode;
}) => {
  const fontVariables = getFontVariables(useAppSelector);
  const pageWise = useAppSelector(selectPageWise);

  const selectedFontFamily = editor
    .getAttributes("textStyle")
    .fontFamily?.includes('"')
    ? editor.getAttributes("textStyle").fontFamily?.replace(/"/g, "'")
    : editor.isActive("heading")
    ? pageWise[CONFIG.headings]?.["font-family"]
    : pageWise["font-family"] || "inherit";

  const finalSelectedFontFamily =
    selectedFontFamily === "initial" ? "inherit" : selectedFontFamily;

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

  const selectedFontSize =
    editor.getAttributes("textStyle").fontSize ||
    (sizedHeadingTags.includes(tag)
      ? (pageWise[tag] as Style)?.["font-size"] || "16px"
      : pageWise["font-size"] || "16px");

  return (
    <div className="absolute z-10 bg-background border border-text rounded p-3 top-5">
      {type === "color" && (
        <ColorPicker
          title="Pick a color"
          selected={
            editor.getAttributes("textStyle").color ||
            pageWise.color ||
            "#000000"
          }
          onChange={(e) => editor.chain().focus().setColor(e).run()}
        />
      )}
      {type === "font-family" && (
        <Select
          title="Pick a font"
          showStyled={true}
          options={[...fontVariables, ...defaultInheritFontOptions]}
          selected={finalSelectedFontFamily}
          onChange={(e) => {
            if (e.target.value === "inherit") {
              editor.chain().focus().unsetFontFamily().run();
            } else {
              editor.chain().focus().setFontFamily(e.target.value).run();
            }
          }}
        />
      )}
      {type === "font-size" && (
        <Slider
          title="Pick a font size"
          step={1}
          value={selectedFontSize}
          onChange={(e) => editor.chain().focus().setFontSize(e).run()}
        />
      )}
      {type === "link" && <Link editor={editor} />}
      {type === "line-height" && (
        <Slider
          units={["", "px", "em", "%"]}
          title="Pick a line-height"
          min={1}
          max={5}
          step={0.5}
          value={
            editor.getAttributes("paragraph").lineHeight ||
            editor.getAttributes("heading").lineHeight ||
            pageWise["line-height"] ||
            "1.5"
          }
          onChange={(e) => {
            editor.chain().focus().setLineHeight(e).run();
          }}
        />
      )}
      {type === "letter-spacing" && (
        <Slider
          letterSpacing={true}
          title="Pick a letter spacing"
          units={["px", "em"]}
          step={1}
          value={
            editor.getAttributes("paragraph").letterSpacing ||
            editor.getAttributes("heading").letterSpacing ||
            "0px"
          }
          onChange={(e) => editor.chain().focus().setLetterSpacing(e).run()}
        />
      )}
      {children}
    </div>
  );
};

const Link = ({ editor }: { editor: Editor }) => {
  const [newtab, setNewTab] = useState(
    editor.getAttributes("link").target === "_blank"
  );
  const [link, setLink] = useState(editor.getAttributes("link").href || "");

  useEffect(() => {
    handleInputChange(link, newtab);
  }, [link, newtab]);

  useEffect(() => {
    const href = editor.getAttributes("link").href || "";
    setLink(href);
  }, [editor.getAttributes("link").href]);

  const handleInputChange = (link: string, newtab: boolean) => {
    if (!link) {
      return editor.chain().focus().unsetLink().run();
    }
    editor.commands.setLink({
      href: link,
      target: newtab ? "_blank" : "_self",
    });
  };
  return (
    <>
      <LinkInput
        title="Enter the link"
        value={link}
        onChange={(e) => {
          setLink(e.target.value);
        }}
      />
      <Checkbox
        title="Open in new tab"
        checked={newtab}
        onChange={() => {
          setNewTab((prev) => !prev);
        }}
      />
    </>
  );
};

export default Popup;
