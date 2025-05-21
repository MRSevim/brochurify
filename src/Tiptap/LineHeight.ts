import { Extension } from "@tiptap/core";

export interface LineHeightOptions {
  types: string[];
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
