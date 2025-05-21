export default function useClasses(id: string, isFixed: boolean = false) {
  const classes = !isFixed ? "w-full h-full " : "";

  return classes;
}
