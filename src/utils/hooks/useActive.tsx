import { selectActive, useAppSelector } from "@/redux/hooks";

export default function useActive(id: string) {
  const activeId = useAppSelector(selectActive)?.id;

  return activeId === id ? "active w-full h-full" : "w-full h-full";
}
