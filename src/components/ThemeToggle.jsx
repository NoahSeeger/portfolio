import { useTheme } from "../hooks/useTheme";
import { FaSun, FaMoon } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="relative w-11 h-11 flex items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95"
      style={{
        backgroundColor: "var(--bg-tertiary)",
        border: "1px solid var(--border)"
      }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
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
      <span
        className="absolute inset-0 rounded-full opacity-0 hover:opacity-[0.15] transition-opacity duration-200"
        style={{ backgroundColor: "var(--accent)" }}
      />
    </button>
  );
}