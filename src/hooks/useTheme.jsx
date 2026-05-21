import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

const THEME_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

function getSystemTheme() {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
}

function isThemeSetManually() {
  const timestamp = localStorage.getItem("themeSetTimestamp");
  if (!timestamp) return false;
  const setTime = parseInt(timestamp, 10);
  const hoursSinceSet = (Date.now() - setTime) / (1000 * 60 * 60);
  return hoursSinceSet < 24;
}

function clearExpiredTheme() {
  localStorage.removeItem("theme");
  localStorage.removeItem("themeSetTimestamp");
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      if (isThemeSetManually()) {
        return localStorage.getItem("theme") || getSystemTheme();
      }
      clearExpiredTheme();
      return getSystemTheme();
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      if (isThemeSetManually()) {
        return;
      }
      setTheme(e.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    localStorage.setItem("themeSetTimestamp", Date.now().toString());
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}