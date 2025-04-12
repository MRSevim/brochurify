import { selectActive, useAppSelector } from "@/redux/hooks";

export default function useActive(id: string, isFixed: boolean = false) {
  const activeId = useAppSelector(selectActive)?.id;

  const classes =
    (activeId === id ? "active " : "") + (!isFixed ? "w-full h-full" : "");

  return classes;
}
