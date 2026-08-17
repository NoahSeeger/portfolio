import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationDE from "./locales/de/translation.json";
import translationEN from "./locales/en/translation.json";

function isGermanLocale() {
  if (typeof navigator === "undefined") return false;
  const langs = navigator.languages || [navigator.language || "en"];
  return langs.some((lang) => {
    const lower = lang.toLowerCase();
    return lower.startsWith("de") || lower === "de" || lower === "de-de" || lower === "de-at" || lower === "de-ch";
  });
}

const initialLang = isGermanLocale() ? "de" : "en";
document.documentElement.lang = initialLang;

i18n.use(initReactI18next).init({
  resources: {
    de: { translation: translationDE },
    en: { translation: translationEN },
  },
  lng: initialLang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  if (lng === "de" || lng === "en") document.documentElement.lang = lng;
});

export default i18n;
