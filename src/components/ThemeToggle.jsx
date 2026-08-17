import { useEffect, useRef, useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { FaSun, FaMoon } from "react-icons/fa6";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const transitionInFlight = useRef(false);
  const timeoutRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [reveal, setReveal] = useState(null);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const handleToggle = (event) => {
    if (transitionInFlight.current || isTransitioning) return;

    const button = event.currentTarget;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      toggleTheme();
      return;
    }

    transitionInFlight.current = true;
    setIsTransitioning(true);
    const rect = button.getBoundingClientRect();
    setReveal({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    toggleTheme();

    timeoutRef.current = window.setTimeout(() => {
      setReveal(null);
      transitionInFlight.current = false;
      setIsTransitioning(false);
    }, 440);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        disabled={isTransitioning}
        aria-busy={isTransitioning}
        className="dock-control relative flex h-9 w-9 items-center justify-center"
        style={{ color: "var(--text-primary)" }}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <span key={theme} className="theme-icon" aria-hidden="true">
          {isDark ? <FaMoon size={16} style={{ color: "var(--accent)" }} /> : <FaSun size={16} style={{ color: "var(--accent)" }} />}
        </span>
      </button>
      {reveal && (
        <span
          className="theme-reveal"
          aria-hidden="true"
          style={{ "--theme-reveal-x": `${reveal.x}px`, "--theme-reveal-y": `${reveal.y}px` }}
        />
      )}
    </>
  );
}
