export const googleFontOptions = [
  { title: "Roboto", value: "'Roboto', sans-serif" },
  { title: "EB Garamond", value: "'EB Garamond', serif" },
  { title: "Dancing Script", value: "'Dancing Script', cursive" },
  { title: "Inter", value: "'Inter', sans-serif" },
  { title: "Space Mono", value: "'Space Mono', monospace" },
  { title: "Merriweather", value: "'Merriweather', serif" },
  { title: "Lobster", value: "'Lobster', cursive" },
  { title: "Courier Prime", value: "'Courier Prime', monospace" },
];

export const mapOverFonts = (fonts: string[], keyed = false) => {
  const getHref = (font: string) =>
    `https://fonts.googleapis.com/css2?family=${font.replace(
      / /g,
      "+"
    )}:ital,wght@0,400;0,700;1,400;1,700&display=swap`;

  if (!keyed) {
    return fonts
      .map(
        (font) => `
      <link
      href="${getHref(font)}"
           rel="stylesheet"/>
           `
      )
      .join("\n");
  }
  return fonts.map((font) => (
    <link key={font} href={getHref(font)} rel="stylesheet" />
  ));
};
