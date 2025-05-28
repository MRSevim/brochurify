import { Extension } from "@tiptap/core";
import TextStyle from "@tiptap/extension-text-style";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    letterSpacing: {
      /**
       * Set the letter spacing
       */
      setLetterSpacing: (letterSpacing: string) => ReturnType;
      /**
       * Unset the letter spacing
       */
      unsetLetterSpacing: () => ReturnType;
    };
  }
}

const LetterSpacing = Extension.create({
  name: "letterSpacing",

  addOptions() {
    return {
      defaultSpacing: null,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          letterSpacing: {
            default: this.options.defaultSpacing,
            parseHTML: (element) =>
              element.style.letterSpacing || this.options.defaultSpacing,
            renderHTML: (attributes) => {
              if (
                !attributes.letterSpacing ||
                attributes.letterSpacing === this.options.defaultSpacing
              ) {
                return {};
              }

              return { style: `letter-spacing: ${attributes.letterSpacing}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setLetterSpacing:
        (letterSpacing: string) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { letterSpacing }).run();
        },

      unsetLetterSpacing:
        () =>
        ({ chain }) => {
          return chain().setMark("textStyle", { letterSpacing: null }).run();
        },
    };
  },

  addExtensions() {
    return [TextStyle]; // Ensure textStyle is registered
  },
});

export default LetterSpacing;
