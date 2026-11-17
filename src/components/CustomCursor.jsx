import { useLayoutEffect } from "react";
import { createCursorValue, DEFAULT_CURSOR_COLOR } from "../lib/cursor";
import { useTheme } from "../hooks/useTheme";
import "./CustomCursor.css";

export function CustomCursor({ color = DEFAULT_CURSOR_COLOR }) {
  const { theme } = useTheme();
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousValue = root.style.getPropertyValue("--portfolio-cursor");
    const previousFlag = root.getAttribute("data-custom-cursor");
    root.style.setProperty("--portfolio-cursor", createCursorValue(color, theme === "dark" ? "#ffffff" : "#111111"));
    root.setAttribute("data-custom-cursor", "");
    return () => {
      if (previousValue) root.style.setProperty("--portfolio-cursor", previousValue);
      else root.style.removeProperty("--portfolio-cursor");
      if (previousFlag === null) root.removeAttribute("data-custom-cursor");
      else root.setAttribute("data-custom-cursor", previousFlag);
    };
  }, [color, theme]);
  return null;
}
