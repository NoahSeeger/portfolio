import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "../hooks/useTheme";
import { FaSun, FaMoon } from "react-icons/fa6";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const transitionInFlight = useRef(false);
  const timeoutRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [fallbackReveal, setFallbackReveal] = useState(null);

  useEffect(() => () => {
    window.clearTimeout(timeoutRef.current);
    delete document.documentElement.dataset.themeTransition;
    document.documentElement.style.removeProperty("--theme-transition-x");
    document.documentElement.style.removeProperty("--theme-transition-y");
    delete document.documentElement.dataset.themeFallback;
  }, []);

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
    const root = document.documentElement;
    root.dataset.themeTransition = "active";
    root.style.setProperty("--theme-transition-x", `${rect.left + rect.width / 2}px`);
    root.style.setProperty("--theme-transition-y", `${rect.top + rect.height / 2}px`);

    if (typeof document.startViewTransition !== "function") {
      root.dataset.themeFallback = "active";
      setFallbackReveal({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        oldColor: isDark ? "#000000" : "#ffffff",
        newColor: isDark ? "#ffffff" : "#000000",
      });
      toggleTheme();
      timeoutRef.current = window.setTimeout(() => {
        setFallbackReveal(null);
        delete root.dataset.themeTransition;
        delete root.dataset.themeFallback;
        root.style.removeProperty("--theme-transition-x");
        root.style.removeProperty("--theme-transition-y");
        transitionInFlight.current = false;
        setIsTransitioning(false);
      }, 580);
      return;
    }

    let didCommitTheme = false;
    const cleanup = () => {
      window.clearTimeout(timeoutRef.current);
      delete root.dataset.themeTransition;
      delete root.dataset.themeFallback;
      root.style.removeProperty("--theme-transition-x");
      root.style.removeProperty("--theme-transition-y");
      transitionInFlight.current = false;
      setIsTransitioning(false);
    };

    try {
      const transition = document.startViewTransition(() => {
        flushSync(() => {
          didCommitTheme = true;
          toggleTheme();
        });
      });

      transition.finished.then(cleanup, cleanup);
      timeoutRef.current = window.setTimeout(cleanup, 900);
    } catch {
      cleanup();
      if (!didCommitTheme) toggleTheme();
    }
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
      {fallbackReveal && (
        <>
          <span
            className="theme-fallback-base"
            aria-hidden="true"
            style={{ background: fallbackReveal.oldColor }}
          />
          <span
            className="theme-fallback-reveal"
            aria-hidden="true"
            style={{
              background: fallbackReveal.newColor,
              "--theme-transition-x": `${fallbackReveal.x}px`,
              "--theme-transition-y": `${fallbackReveal.y}px`,
            }}
          />
        </>
      )}
    </>
  );
}
