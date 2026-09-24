// Content fields are either a plain string or a { fr, en } object.
// Falls back to French, then to any filled language (visitor reviews are written in one).
export function localize(value, lang) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[lang] || value.fr || Object.values(value).find(Boolean) || "";
}
