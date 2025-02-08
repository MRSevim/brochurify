import Checkbox from "@/components/Checkbox";
import ColorPicker from "@/components/ColorPicker";
import LinkInput from "@/components/LinkInput";
import Select from "@/components/Select";
import Slider from "@/components/Slider";
import { fontOptions } from "@/utils/Helpers";
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
  return (
    <div className="absolute z-10 bg-background border border-text rounded p-3 top-5">
      {type === "color" && (
        <ColorPicker
          title="Pick a color"
          selected={editor.getAttributes("textStyle").color || "#000000"}
          onChange={(e) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
        />
      )}
      {type === "font-family" && (
        <Select
          title="Pick a font"
          options={fontOptions}
          selected={editor.getAttributes("textStyle").fontFamily || ""}
          onChange={(e) => {
            if (e.target.value === "default") {
              editor.chain().focus().unsetFontFamily().run();
            } else {
              editor.chain().focus().setFontFamily(e.target.value).run();
            }
          }}
        />
      )}
      {type === "font-size" && (
        <Slider
          parse={true}
          title="Pick a font size"
          min={1}
          max={70}
          step={1}
          value={editor.getAttributes("textStyle").fontSize || "16px"}
          onChange={(e) =>
            editor
              .chain()
              .focus()
              .setFontSize(e.target.value + "px")
              .run()
          }
        />
      )}
      {type === "link" && <Link editor={editor} />}
      {type === "line-height" && (
        <Slider
          parse={false}
          title="Pick a line-height"
          min={1}
          max={5}
          step={0.5}
          value={
            editor.getAttributes("paragraph").lineHeight ||
            editor.getAttributes("heading").lineHeight ||
            "1.5"
          }
          onChange={(e) =>
            editor.chain().focus().setLineHeight(e.target.value).run()
          }
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
      {" "}
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
