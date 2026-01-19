import { OptionsObject } from "@/features/builder/utils/types.d";
import { makeArraySplitFrom } from "@/utils/Helpers";

export const availableTimingFunctions: OptionsObject[] = [
  { title: "Start slow, middle fast, end slow (ease)", value: "ease" },
  { title: "Start slow, end fast (ease-in)", value: "ease-in" },
  { title: "Start fast, end slow (ease-out)", value: "ease-out" },
  {
    title: "Start slow, middle fast, end slow (ease-in-out)",
    value: "ease-in-out",
  },
  {
    title: "Linear speed",
    value: "linear",
  },
];

export const addToString = (
  str: string,
  newVal: string,
  splitValue: string,
): string => {
  if (!str) {
    return newVal;
  } else {
    const arr = makeArraySplitFrom(str, splitValue);
    return [...arr.map((str) => str.trim()), newVal].join(splitValue);
  }
};
