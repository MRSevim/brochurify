import { selectActive, useAppSelector } from "@/redux/hooks";

export default function useActive(id: string, isFixed: boolean = false) {
  const activeId = useAppSelector(selectActive)?.id;
  const commonClasses = "element " + (!isFixed ? "w-full h-full" : "");

  return activeId === id ? "active " + commonClasses : commonClasses;
}
