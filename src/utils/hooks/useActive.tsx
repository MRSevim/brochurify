import { useAppSelector } from "@/redux/hooks";

export default function useActive(id: string) {
  const activeId = useAppSelector((state) => state.editor.active?.id);

  return activeId === id ? "active" : "";
}
