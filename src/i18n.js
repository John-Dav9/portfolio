import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import fr from "./locales/fr.json";

const SUPPORTED = ["fr", "en"];

function readStoredLanguage() {
  try {
    return localStorage.getItem("language");
  } catch {
    return null;
  }
}

function initialLanguage() {
  const stored = readStoredLanguage();
  if (SUPPORTED.includes(stored)) return stored;
  const browser = (navigator.language || "").slice(0, 2);
  return SUPPORTED.includes(browser) ? browser : "fr";
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: initialLanguage(),
  fallbackLng: "fr",
  supportedLngs: SUPPORTED,
  interpolation: {
    escapeValue: false,
  },
});

const syncDocumentLanguage = (lng) => {
  document.documentElement.lang = lng;
};

syncDocumentLanguage(i18n.language);
i18n.on("languageChanged", (lng) => {
  syncDocumentLanguage(lng);
  try {
    localStorage.setItem("language", lng);
  } catch {
    // Storage unavailable (private mode): the choice lasts for this visit only.
  }
});

export default i18n;
