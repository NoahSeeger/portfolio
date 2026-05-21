import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationDE from "./locales/de/translation.json";
import translationEN from "./locales/en/translation.json";

const LANG_EXPIRY_MS = 24 * 60 * 60 * 1000;

function isGermanLocale() {
  if (typeof navigator === "undefined") return false;
  const langs = navigator.languages || [navigator.language || "en"];
  return langs.some((lang) => {
    const lower = lang.toLowerCase();
    return lower.startsWith("de") || lower === "de" || lower === "de-de" || lower === "de-at" || lower === "de-ch";
  });
}

function isLangSetManually() {
  const timestamp = localStorage.getItem("langSetTimestamp");
  if (!timestamp) return false;
  const setTime = parseInt(timestamp, 10);
  const hoursSinceSet = (Date.now() - setTime) / (1000 * 60 * 60);
  return hoursSinceSet < 24;
}

function clearExpiredLang() {
  localStorage.removeItem("lang");
  localStorage.removeItem("langSetTimestamp");
}

function detectInitialLanguage() {
  if (isLangSetManually()) {
    return localStorage.getItem("lang") || (isGermanLocale() ? "de" : "en");
  }
  clearExpiredLang();
  return isGermanLocale() ? "de" : "en";
}

const initialLang = detectInitialLanguage();

i18n.use(initReactI18next).init({
  resources: {
    de: { translation: translationDE },
    en: { translation: translationEN },
  },
  lng: initialLang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

function setUserLang(lng) {
  localStorage.setItem("lang", lng);
  localStorage.setItem("langSetTimestamp", Date.now().toString());
}

i18n.on("languageChanged", (lng) => {
  if (lng === "de" || lng === "en") {
    setUserLang(lng);
  }
});

export { setUserLang };
export default i18n;