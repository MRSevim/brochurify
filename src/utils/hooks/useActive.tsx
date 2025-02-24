import { selectActive, useAppSelector } from "@/redux/hooks";

export default function useActive(id: string) {
  const activeId = useAppSelector(selectActive)?.id;
  const commonClasses = "w-full h-full element";

  return activeId === id ? "active " + commonClasses : commonClasses;
}
