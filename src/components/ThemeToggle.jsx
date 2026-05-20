import { useTheme } from "../hooks/useTheme";
import { FaSun, FaMoon } from "react-icons/fa6";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-11 h-11 flex items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95"
      style={{
        backgroundColor: "var(--bg-tertiary)",
        border: "1px solid var(--border)"
      }}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === "dark" ? 180 : 0
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-center"
      >
        {theme === "dark" ? (
          <FaMoon size={16} style={{ color: "var(--accent)" }} />
        ) : (
          <FaSun size={16} style={{ color: "var(--accent)" }} />
        )}
      </motion.div>
      <span
        className="absolute inset-0 rounded-full opacity-0 hover:opacity-[0.15] transition-opacity duration-200"
        style={{ backgroundColor: "var(--accent)" }}
      />
    </button>
  );
}