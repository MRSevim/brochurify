import { Extension } from "@tiptap/core";

export interface LineHeightOptions {
  types: string[];
  heights: string[];
  defaultHeight: string | null;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    lineHeight: {
      /**
       * Set the line height attribute
       */
      setLineHeight: (height: string) => ReturnType;
      /**
       * Unset the line height attribute
       */
      unsetLineHeight: () => ReturnType;
    };
  }
}

const LineHeight = Extension.create<LineHeightOptions>({
  name: "lineHeight",

  addOptions() {
    return {
      types: ["heading", "paragraph"],
      heights: ["1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5"],
      defaultHeight: null,
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: this.options.defaultHeight,
            parseHTML: (element) =>
              element.style.lineHeight || this.options.defaultHeight,
            renderHTML: (attributes) => {
              if (attributes.lineHeight === this.options.defaultHeight) {
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
        (height: string) =>
        ({ commands }) => {
          if (!this.options.heights.includes(height)) {
            return false;
          }

          return this.options.types.every((type) =>
            commands.updateAttributes(type, { lineHeight: height })
          );
        },

      unsetLineHeight:
        () =>
        ({ commands }) => {
          return this.options.types.every((type) =>
            commands.resetAttributes(type, "lineHeight")
          );
        },
    };
  },
});
export default LineHeight;
