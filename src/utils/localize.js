// Content fields are either a plain string or a { fr, en } object.
export function localize(value, lang) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[lang] ?? value.fr ?? "";
}
