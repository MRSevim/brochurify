import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

export const PreventBlurFromToolbar = Extension.create({
  name: "preventBlurFromToolbar",

  addProseMirrorPlugins() {
    const plugin: Plugin<any> = new Plugin({
      props: {
        handleDOMEvents: {
          mousedown: (view, event) => {
            const el = event.target as HTMLElement;
            if (el.closest(".editor-toolbar")) {
              event.preventDefault();
              return false;
            }
            return false;
          },
        },
      },
    });

    return [plugin]; // <- TS now infers this as Plugin<any>[]
  },
});
