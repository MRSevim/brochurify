import ColorPicker from "@/components/ColorPicker";
import LinkInput from "@/components/LinkInput";
import Select from "@/components/Select";
import Slider from "@/components/Slider";
import { fontOptions } from "@/utils/Helpers";
import { Editor } from "@tiptap/react";

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
    <div className="absolute z-10 bg-dark border border-light rounded p-3 top-5">
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
          onChange={(e) =>
            editor.chain().focus().setFontFamily(e.target.value).run()
          }
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
      {type === "link" && (
        <LinkInput
          title="Enter the link"
          value={editor.getAttributes("link").href || ""}
          onChange={(e) =>
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: e.target.value })
              .run()
          }
        />
      )}
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

export default Popup;
