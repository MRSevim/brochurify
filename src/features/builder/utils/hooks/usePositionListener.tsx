import { useEffect } from "react";
import { useEditorRef } from "@/features/builder/utils/contexts/EditorRefContext";

export default function usePositionListener(
  update: () => void,
  listener = false
) {
  const editorRef = useEditorRef();

  useEffect(() => {
    update();
    const editor = editorRef.current;
    if (!editor) return;

    // Debounce utility
    let animationFrame: number;
    const onScrollOrResize = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(update);
    };
    if (listener) {
      editor.addEventListener("scroll", onScrollOrResize);
      editor.addEventListener("resize", onScrollOrResize);
    }
    return () => {
      editor.removeEventListener("scroll", onScrollOrResize);
      editor.removeEventListener("resize", onScrollOrResize);
      cancelAnimationFrame(animationFrame);
    };
  }, [editorRef.current]);
}
