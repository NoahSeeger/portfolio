import { featuredApps } from "../content/apps";
import { TextReveal } from "./TextReveal";
import { useTheme } from "../hooks/useTheme";
import { createCursorValue } from "../lib/cursor";
import "./InlineApps.css";

function AppLink({ app }) {
  const { theme } = useTheme();
  const palette = app.palette[theme === "dark" ? "dark" : "light"];
  return (
    <a className={`inline-app-chip inline-app-chip-${app.id}`} href={app.href}
      style={{
        "--chip-start": palette.start,
        "--chip-end": palette.end,
        "--chip-ink": palette.ink,
        "--chip-border": palette.border,
        "--portfolio-cursor": createCursorValue(palette.start, theme === "dark" ? "#ffffff" : "#111111", palette.end),
      }}
      target="_blank" rel="noopener noreferrer" title={`${app.name} — ${app.destination}`}>
      <img className="inline-app-icon" src={app.icon} alt="" width="24" height="24" decoding="async" draggable="false" />
      <span>{app.name}</span>
      <svg className="inline-app-arrow" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="m3 9 6-6M3 3h6v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span className="sr-only"> — {app.destination}</span>
    </a>
  );
}

export function InlineApps() {
  return (
    <TextReveal content={[
      "Building iOS apps like ",
      <AppLink key="picswipe" app={featuredApps[0]} />, ", ",
      <AppLink key="quanta" app={featuredApps[1]} />, " and ",
      <AppLink key="birthday-calendar" app={featuredApps[2]} />, " in my free time.",
    ]}>
      Building iOS apps like PicSwipe, Quanta and Birthday Calendar in my free time.
    </TextReveal>
  );
}
