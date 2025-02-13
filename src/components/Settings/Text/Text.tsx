import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import BottomLine from "../../BottomLine";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Underline from "@tiptap/extension-underline";
import FontFamily from "@tiptap/extension-font-family";
import FontSize from "tiptap-extension-font-size";
import StarterKit from "@tiptap/starter-kit";
import Color from "@tiptap/extension-color";
import LineHeight from "@/Tiptap/LineHeight";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import { getProp } from "@/utils/Helpers";
import Icon from "../../Icon";
import { useEffect, useState } from "react";
import { HeadingLevel } from "@/utils/Types";
import SecondaryTitle from "../../SecondaryTitle";
import Popup from "./Popup";
import { updateText } from "@/redux/slices/editorSlice";
import sanitizeHtml from "sanitize-html";
import LetterSpacing from "@/Tiptap/LetterSpacing";

const Text = () => {
  const content = getProp<string>(useAppSelector, "text");
  const dispatch = useAppDispatch();
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Color,
      TextStyle,
      LetterSpacing,
      Link,
      Superscript,
      Subscript,
      Underline,
      FontFamily,
      FontSize,
      LineHeight,
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "bg-white text-black p-2 rounded",
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

  useEffect(() => {
    if (!editor) return;

    // Listen for editor content updates
    const updateHandler = () => {
      const rawHtml = editor.getHTML(); // Get current HTML
      // ✅ Sanitize the HTML (remove unwanted tags)
      const cleanHtml = sanitizeHtml(rawHtml, {
        allowedTags: [
          "p",
          "span",
          "strong",
          "blockquote",
          "em",
          "u",
          "s",
          "sub",
          "sup",
          "a",
          "code",
          "hr",
          "br",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "ul",
          "ol",
          "li",
        ], // Only allow needed tags
        allowedAttributes: {
          a: ["href", "target"],
          "*": ["style"], // Allow style attribute for all tags
        },
      });

      dispatch(updateText(cleanHtml));
    };

    editor.on("update", updateHandler);

    return () => {
      editor.off("update", updateHandler); // Cleanup event listener
    };
  }, [editor, dispatch]);

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
  const [popup, setPopup] = useState("");
  const className = "p-1 border rounded";
  const size = "1.2rem";
  const Icons: {
    type: string;
    onClick: (() => void) | (() => boolean);
    title: string;
    active?: boolean;
  }[] = [
    {
      type: "arrow-counterclockwise",
      onClick: () => editor.chain().focus().undo().run(),
      title: "Undo",
    },
    {
      type: "arrow-clockwise",
      onClick: () => editor.chain().focus().redo().run(),
      title: "Redo",
    },
    {
      type: "type-bold",
      onClick: () => editor.chain().focus().toggleBold().run(),
      title: "Bold",
      active: editor.isActive("bold"),
    },
    {
      type: "type-italic",
      onClick: () => editor.chain().focus().toggleItalic().run(),
      title: "Italic",
      active: editor.isActive("italic"),
    },
    {
      type: "type-underline",
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      title: "Underline",
      active: editor.isActive("underline"),
    },
    {
      type: "type-strikethrough",
      onClick: () => editor.chain().focus().toggleStrike().run(),
      title: "Strikethrough",
      active: editor.isActive("strike"),
    },
    {
      type: "subscript",
      onClick: () => editor.chain().focus().toggleSubscript().run(),
      title: "Subscript",
      active: editor.isActive("subscript"),
    },
    {
      type: "superscript",
      onClick: () => editor.chain().focus().toggleSuperscript().run(),
      title: "Superscript",
      active: editor.isActive("superscript"),
    },
    {
      type: "text-left",
      onClick: () => {
        if (!editor.isActive({ textAlign: "left" })) {
          editor.chain().focus().setTextAlign("left").run();
        } else {
          editor.chain().focus().unsetTextAlign().run();
        }
      },
      title: "Text align left",
      active: editor.isActive({ textAlign: "left" }),
    },
    {
      type: "text-center",
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      title: "Text align center",
      active: editor.isActive({ textAlign: "center" }),
    },
    {
      type: "text-right",
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      title: "Text align right",
      active: editor.isActive({ textAlign: "right" }),
    },
    {
      type: "palette",
      onClick: () => {
        setPopup("color");
      },
      title: "Text color",
      active: editor.getAttributes("textStyle").color,
    },
    {
      type: "type",
      onClick: () => {
        setPopup("font-family");
      },
      title: "Font family",
      active: editor.getAttributes("textStyle").fontFamily,
    },
    {
      type: "123",
      onClick: () => {
        setPopup("font-size");
      },
      title: "Font size",
      active: editor.getAttributes("textStyle").fontSize,
    },
    {
      type: "blockquote-left",
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      title: "Blockquote",
      active: editor.isActive("blockquote"),
    },
    {
      type: "code",
      onClick: () => editor.chain().focus().toggleCode().run(),
      title: "Code",
      active: editor.isActive("code"),
    },
    {
      type: "list-ul",
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      title: "Unordered list",
      active: editor.isActive("bulletList"),
    },
    {
      type: "list-ol",
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      title: "Ordered list",
      active: editor.isActive("orderedList"),
    },
    {
      type: "link-45deg",
      onClick: () => {
        setPopup("link");
      },
      title: "Link",
      active: editor.isActive("link"),
    },
    {
      type: "arrows-vertical",
      onClick: () => {
        setPopup("line-height");
      },
      title: "Line height",
      active:
        editor.getAttributes("paragraph").lineHeight ||
        editor.getAttributes("heading").lineHeight,
    },
    {
      type: "arrows",
      onClick: () => {
        setPopup("letter-spacing");
      },
      title: "Letter spacing",
      active:
        editor.getAttributes("paragraph").letterSpacing ||
        editor.getAttributes("heading").letterSpacing,
    },
    {
      type: "arrow-return-left",
      onClick: () => editor.chain().focus().setHardBreak().run(),
      title: "Hard break",
    },
    {
      type: "hr",
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
      title: "Horizontal rule",
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
        title: "Heading level " + level,
        active: editor.isActive("heading", { level }),
      };
    }),
  ];

  return (
    <div className="relative flex gap-2 justify-center mb-2 border-b pb-2 flex-wrap">
      {popup && (
        <Popup type={popup} editor={editor}>
          <div className="flex justify-center gap-2">
            <button
              className="p-1 text-background bg-gray rounded cursor-pointer"
              onClick={() => setPopup("")}
            >
              {" "}
              Close
            </button>
            <button
              className="p-1 text-background bg-gray rounded cursor-pointer"
              onClick={() => {
                if (popup === "color") {
                  editor.chain().focus().unsetColor().run();
                } else if (popup === "font-family") {
                  editor.chain().focus().unsetFontFamily().run();
                } else if (popup === "font-size") {
                  editor.chain().focus().unsetFontSize().run();
                } else if (popup === "link") {
                  editor.chain().focus().unsetLink().run();
                } else if (popup === "line-height") {
                  editor.chain().focus().unsetLineHeight().run();
                } else if (popup === "letter-spacing") {
                  editor.chain().focus().unsetLetterSpacing().run();
                }
              }}
            >
              Unset
            </button>
          </div>
        </Popup>
      )}
      {Icons.map((item) => (
        <Icon
          title={item.title}
          key={item.type}
          type={item.type}
          size={size}
          className={
            className + (item.active ? " bg-text text-background" : "")
          }
          onClick={item.onClick}
        />
      ))}
    </div>
  );
};
