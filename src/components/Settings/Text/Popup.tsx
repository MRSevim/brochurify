import ColorPicker from "@/components/ColorPicker";
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
          title="Pick a font size"
          min={1}
          max={50}
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
      {children}
    </div>
  );
};

export default Popup;
