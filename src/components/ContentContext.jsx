import { createContext, useContext, useEffect, useState } from "react";
import i18n from "../i18n";
import bundledData from "../data/index.json";
import bundledSite from "../data/site.json";
import { api } from "../services/api";

// Shipped with the build: shown instantly, and kept if the API is unreachable.
const EMPTY_CV = { dev: { fr: "", en: "" }, data: { fr: "", en: "" } };
export const BUNDLED_CONTENT = {
  site: bundledSite,
  skills: bundledData.skills,
  projects: bundledData.portfolio,
  timeline: bundledData.timeline,
  testimonials: bundledData.testimonials,
  texts: null,
  cv: EMPTY_CV,
};

const ContentContext = createContext(BUNDLED_CONTENT);

// Admin-edited strings ("hero.pitch.dev": "…") override the locale files.
function applyTextOverrides(texts) {
  for (const [lang, entries] of Object.entries(texts ?? {})) {
    const nested = {};
    for (const [key, value] of Object.entries(entries)) {
      if (!value) continue;
      const parts = key.split(".");
      let node = nested;
      parts.slice(0, -1).forEach((part) => {
        node[part] ??= {};
        node = node[part];
      });
      node[parts.at(-1)] = value;
    }
    i18n.addResourceBundle(lang, "translation", nested, true, true);
  }
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(BUNDLED_CONTENT);

  useEffect(() => {
    let cancelled = false;
    api("/content")
      .then((remote) => {
        if (cancelled || !remote?.site) return;
        applyTextOverrides(remote.texts);
        setContent({ ...BUNDLED_CONTENT, ...remote, cv: remote.cv ?? EMPTY_CV, timeline: remote.timeline ?? BUNDLED_CONTENT.timeline });
      })
      .catch(() => {
        // API down: keep the bundled content.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export const useContent = () => useContext(ContentContext);
