import { useRef, useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { FaSun, FaMoon } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { flushSync } from "react-dom";

function getThemeClipPath(button) {
  const { left, top, width, height } = button.getBoundingClientRect();
  const x = left + width / 2;
  const y = top + height / 2;
  const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  const radius = Math.hypot(
    Math.max(x, viewportWidth - x),
    Math.max(y, viewportHeight - y),
  );

  return {
    x,
    y,
    from: `circle(0px at ${x}px ${y}px)`,
    to: `circle(${radius}px at ${x}px ${y}px)`,
  };
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const transitionInFlight = useRef(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleToggle = (event) => {
    if (transitionInFlight.current) return;

    const button = event.currentTarget;
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || typeof document.startViewTransition !== "function") {
      toggleTheme();
      return;
    }

    transitionInFlight.current = true;
    setIsTransitioning(true);
    const clip = getThemeClipPath(button);
    const root = document.documentElement;
    root.dataset.themeTransition = "active";
    root.style.setProperty("--theme-vt-clip-from", clip.from);

    const cleanup = () => {
      delete root.dataset.themeTransition;
      root.style.removeProperty("--theme-vt-clip-from");
      transitionInFlight.current = false;
      setIsTransitioning(false);
    };

    let transition;
    try {
      transition = document.startViewTransition(() => {
        flushSync(toggleTheme);
      });
    } catch {
      cleanup();
      toggleTheme();
      return;
    }

    transition.finished.then(cleanup, cleanup);
    transition.ready.then(() => {
      root.animate(
        { clipPath: [clip.from, clip.to] },
        {
          duration: 420,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    }).catch(cleanup);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isTransitioning}
      aria-busy={isTransitioning}
      className="dock-control relative flex h-9 w-9 items-center justify-center"
      style={{
        color: "var(--text-primary)",
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <FaMoon size={16} style={{ color: "var(--accent)" }} />
          ) : (
            <FaSun size={16} style={{ color: "var(--accent)" }} />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
