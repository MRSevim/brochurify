import { Extension } from "@tiptap/core";

export interface LetterSpacingOptions {
  types: string[];
  defaultSpacing: null;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    letterSpacing: {
      /**
       * Set the line height attribute
       */
      setLetterSpacing: (spacing: string) => ReturnType;
      /**
       * Unset the line height attribute
       */
      unsetLetterSpacing: () => ReturnType;
    };
  }
}

const LetterSpacing = Extension.create<LetterSpacingOptions>({
  name: "letterSpacing",

  addOptions() {
    return {
      types: ["heading", "paragraph"],
      defaultSpacing: null,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          letterSpacing: {
            default: this.options.defaultSpacing,
            parseHTML: (element) =>
              element.style.letterSpacing || this.options.defaultSpacing,
            renderHTML: (attributes) => {
              if (!attributes.letterSpacing) {
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
        ({ commands }) => {
          return this.options.types.every((type) =>
            commands.updateAttributes(type, { letterSpacing })
          );
        },

      unsetLetterSpacing:
        () =>
        ({ commands }) => {
          return this.options.types.every((type) =>
            commands.resetAttributes(type, "letterSpacing")
          );
        },
    };
  },
});
export default LetterSpacing;
