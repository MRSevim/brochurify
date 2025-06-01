import { Extension } from "@tiptap/core";
import TextStyle from "@tiptap/extension-text-style";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    lineHeight: {
      /**
       * Set the line height
       */
      setLineHeight: (lineHeight: string) => ReturnType;
      /**
       * Unset the line height
       */
      unsetLineHeight: () => ReturnType;
    };
  }
}

const LineHeight = Extension.create({
  name: "LineHeight",

  addOptions() {
    return {
      defaultHeight: null,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          lineHeight: {
            default: this.options.defaultHeight,
            parseHTML: (element) =>
              element.style.lineHeight || this.options.defaultHeight,
            renderHTML: (attributes) => {
              if (
                !attributes.lineHeight ||
                attributes.lineHeight === this.options.defaultHeight
              ) {
                return {};
              }

              return { style: `line-height: ${attributes.lineHeight}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLineHeight:
        (lineHeight: string) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { lineHeight }).run();
        },

      unsetLineHeight:
        () =>
        ({ chain }) => {
          return chain().setMark("textStyle", { lineHeight: null }).run();
        },
    };
  },

  addExtensions() {
    return [TextStyle]; // Ensure textStyle is registered
  },
});

export default LineHeight;
