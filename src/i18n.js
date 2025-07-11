import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationDE from "./locales/de/translation.json";
import translationEN from "./locales/en/translation.json";

// Sprache aus localStorage oder Browser ermitteln
function detectInitialLanguage() {
  const stored = localStorage.getItem("lang");
  if (stored && (stored === "de" || stored === "en")) return stored;
  const browser = navigator.language || navigator.userLanguage;
  if (browser && browser.toLowerCase().startsWith("de")) return "de";
  if (browser && browser.toLowerCase().startsWith("en")) return "en";
  return "de"; // fallback
}

const initialLang = detectInitialLanguage();

i18n.use(initReactI18next).init({
  resources: {
    de: { translation: translationDE },
    en: { translation: translationEN },
  },
  lng: initialLang,
  fallbackLng: "de",
  interpolation: { escapeValue: false },
});

// Sprache bei Wechsel in localStorage speichern
// (wird in Header.jsx auch gemacht, aber hier als Fallback)
i18n.on("languageChanged", (lng) => {
  if (lng === "de" || lng === "en") {
    localStorage.setItem("lang", lng);
  }
});

export default i18n;
