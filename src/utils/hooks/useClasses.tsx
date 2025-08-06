export default function useClasses(isFixed: boolean = false) {
  const classes = !isFixed ? "w-full h-full editor-element" : "editor-element";

  return classes;
}
