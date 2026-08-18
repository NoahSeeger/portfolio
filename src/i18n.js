import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationDE from "./locales/de/translation.json";
import translationEN from "./locales/en/translation.json";

// The language selector is intentionally disabled while the copy is being
// written. Keeping one language active avoids a half-translated interface.
const initialLang = "en";
if (typeof document !== "undefined") document.documentElement.lang = initialLang;

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
  if ((lng === "de" || lng === "en") && typeof document !== "undefined") {
    document.documentElement.lang = lng;
  }
});

export default i18n;
