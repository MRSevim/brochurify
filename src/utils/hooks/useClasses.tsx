export default function useClasses(isFixed: boolean = false) {
  const classes = !isFixed ? "w-full h-full" : "";

  return classes;
}
