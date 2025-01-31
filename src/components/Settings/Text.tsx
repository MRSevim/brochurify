import { useAppSelector } from "@/redux/hooks";
import BottomLine from "../BottomLine";
import ToggleVisibilityWrapper from "../ToggleVisibilityWrapper";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Underline from "@tiptap/extension-underline";
import FontFamily from "@tiptap/extension-font-family";
import FontSize from "tiptap-extension-font-size";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { getProp } from "@/utils/Helpers";
import Icon from "../Icon";
import { useEffect } from "react";
import { HeadingLevel } from "@/utils/Types";
import SecondaryTitle from "../SecondaryTitle";

const Text = () => {
  const content = getProp<string>(useAppSelector, "text");
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Color,
      TextStyle,
      Link,
      Superscript,
      Subscript,
      Underline,
      FontFamily,
      FontSize,
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "bg-light text-dark p-2 rounded",
      },
    },
  });
  useEffect(() => {
    if (editor) {
      editor.view.dom.addEventListener(
        "dragstart",
        (event) => event.preventDefault()
        //prevents dragging
      );
    }
  }, [editor]);

  return (
    <div className="relative pb-2 mb-2">
      <SecondaryTitle title="Editable Text" />
      <EditBar editor={editor} />
      <EditorContent editor={editor} />
      <BottomLine />
    </div>
  );
};

export default Text;

const EditBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  const className = "p-1 border rounded";
  const size = "1.2rem";
  const Icons = [
    {
      type: "arrow-counterclockwise",
      onClick: () => editor.chain().focus().undo().run(),
    },
    {
      type: "arrow-clockwise",
      onClick: () => editor.chain().focus().redo().run(),
    },
    {
      type: "type-bold",
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      type: "type-italic",
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      type: "type-underline",
      onClick: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      type: "type-strikethrough",
      onClick: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      type: "subscript",
      onClick: () => editor.chain().focus().toggleSubscript().run(),
    },
    {
      type: "superscript",
      onClick: () => editor.chain().focus().toggleSuperscript().run(),
    },
    {
      type: "text-left",
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
    },
    {
      type: "text-center",
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
    },
    {
      type: "text-right",
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
    },
    {
      type: "palette",
      onClick: () => {
        const color = prompt("Enter text color (hex or name):");
        if (color) editor.chain().focus().setColor(color).run();
      },
    },
    {
      type: "type",
      onClick: () => {
        const font = prompt("Enter font family:");
        if (font) editor.chain().focus().setFontFamily(font).run();
      },
    },
    {
      type: "123",
      onClick: () => {
        const size = prompt("Enter font size (e.g., 16px, 2em):");
        if (size) editor.chain().focus().setFontSize(size).run();
      },
    },
    {
      type: "blockquote-left",
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      type: "code",
      onClick: () => editor.chain().focus().toggleCode().run(),
    },
    {
      type: "list-ul",
      onClick: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      type: "list-ol",
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      type: "link-45deg",
      onClick: () => {
        const url = prompt("Enter URL:");
        if (url) editor.chain().focus().setLink({ href: url }).run();
      },
    },
    {
      type: "arrows-vertical",
      onClick: () => {
        const lineHeight = prompt("Enter line height (e.g., 1.5, 2):");
        if (lineHeight) {
          /*   editor.chain().focus().setLineHeight(lineHeight).run(); */
        }
      },
    },
    {
      type: "arrow-return-left",
      onClick: () => editor.chain().focus().setHardBreak().run(),
    },
    {
      type: "hr",
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
    },
    ...[1, 2, 3, 4, 5, 6].map((level) => {
      return {
        type: `type-h${level}`,
        onClick: () =>
          editor
            .chain()
            .focus()
            .toggleHeading({ level: level as HeadingLevel })
            .run(),
      };
    }),
  ];

  return (
    <div className="flex gap-2 justify-center mb-2 border-b pb-2 flex-wrap">
      {Icons.map((item) => (
        <Icon
          key={item.type}
          type={item.type}
          size={size}
          className={className}
          onClick={item.onClick}
        />
      ))}
    </div>
  );
};
