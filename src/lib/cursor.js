export const DEFAULT_CURSOR_COLOR = "#368cff";
// Native SVG geometry and hotspot stay the same for every color variant.
const CURSOR_ARROW_PATH = "M15 9Q16 7 19.5 9Q23 11 27.5 16Q32 21 33 21Q34 21 36.5 23.5Q39 26 39 27Q39 28 38 28.5Q37 29 33.5 29Q30 29 29 30Q28 31 28.5 34.5Q29 38 30.5 40.5Q32 43 32 44.5Q32 46 30.5 45.5Q29 45 28 41Q27 37 25.5 35Q24 33 22.5 33Q21 33 17 35.5Q13 38 13.5 24.5Q14 11 15 9Z";
const CURSOR_HOTSPOT = { x: 11, y: 5 };

// A self-contained static SVG is rendered by the browser as the actual cursor.
// No image request, mousemove listener, animation loop or follower element.
export function createCursorValue(color = DEFAULT_CURSOR_COLOR, outline = "#111111", gradientEnd = null) {
  const fill = /^#[\da-f]{3}(?:[\da-f]{3})?$/i.test(color) ? color : DEFAULT_CURSOR_COLOR;
  const stroke = /^#[\da-f]{3}(?:[\da-f]{3})?$/i.test(outline) ? outline : "#111111";
  const end = typeof gradientEnd === "string" && /^#[\da-f]{3}(?:[\da-f]{3})?$/i.test(gradientEnd) ? gradientEnd : null;
  const gradient = end ? `<linearGradient id="cursor-fill" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${fill}"/><stop offset="1" stop-color="${end}"/></linearGradient>` : "";
  const paint = end ? "url(#cursor-fill)" : fill;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="45" viewBox="0 0 51 64"><defs>${gradient}<filter id="shadow" x="-35%" y="-25%" width="180%" height="180%" color-interpolation-filters="sRGB"><feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#000" flood-opacity=".3"/></filter></defs><path d="${CURSOR_ARROW_PATH}" fill="${paint}" stroke="${stroke}" stroke-width="4.3" stroke-linejoin="round" filter="url(#shadow)"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${CURSOR_HOTSPOT.x} ${CURSOR_HOTSPOT.y}`;
}
