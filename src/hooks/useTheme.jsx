import { createContext, useContext, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });
const validTheme = (value) => value === "light" || value === "dark" ? value : null;
const systemTheme = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
function initialTheme() {
  let preference = null;
  try { preference = validTheme(window.localStorage.getItem("theme")); } catch { /* System preference still works without storage. */ }
  return { preference, theme: preference || systemTheme() };
}

export function ThemeProvider({ children }) {
  const [state, setState] = useState(initialTheme);
  const current = useRef(state);
  const apply = useCallback((next) => { current.current = next; setState(next); }, []);
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", state.theme === "dark");
    root.style.colorScheme = state.theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = window.getComputedStyle(root).getPropertyValue("--bg-primary").trim();
  }, [state.theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const systemChange = (event) => {
      if (!current.current.preference) apply({ preference: null, theme: event.matches ? "dark" : "light" });
    };
    const storageChange = (event) => {
      if (event.key !== "theme" && event.key !== null) return;
      const preference = validTheme(event.newValue);
      apply({ preference, theme: preference || systemTheme() });
    };
    media.addEventListener("change", systemChange);
    window.addEventListener("storage", storageChange);
    return () => {
      media.removeEventListener("change", systemChange);
      window.removeEventListener("storage", storageChange);
    };
  }, [apply]);

  const toggleTheme = useCallback(() => {
    const theme = current.current.theme === "light" ? "dark" : "light";
    // Remember the user's choice in memory even if browser storage is blocked.
    apply({ theme, preference: theme });
    try { window.localStorage.setItem("theme", theme); } catch { /* Session choice remains active. */ }
  }, [apply]);
  const value = useMemo(() => ({ theme: state.theme, toggleTheme }), [state.theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() { return useContext(ThemeContext); }
