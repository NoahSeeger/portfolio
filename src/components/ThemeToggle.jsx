import { useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "../hooks/useTheme";
import { createThemeTransition } from "../lib/theme-transition";
import { FaSun, FaMoon } from "react-icons/fa6";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const controller = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  useLayoutEffect(() => {
    const transition = createThemeTransition({
      document, window,
      commit: () => flushSync(toggleTheme),
      onBusy: setIsTransitioning,
    });
    controller.current = transition;
    return () => { transition.dispose(); controller.current = null; };
  }, [toggleTheme]);
  const isDark = theme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";
  return (
    <button type="button" onClick={(event) => controller.current?.run(event.currentTarget)}
      aria-disabled={isTransitioning || undefined} aria-busy={isTransitioning}
      className="dock-control relative flex h-9 w-9 items-center justify-center"
      style={{ color: "var(--text-primary)" }} aria-label={label} title={label}>
      <span className="theme-icon" aria-hidden="true">
        {isDark ? <FaMoon size={16} /> : <FaSun size={16} />}
      </span>
    </button>
  );
}
