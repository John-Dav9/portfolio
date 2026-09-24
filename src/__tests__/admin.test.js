import { describe, expect, it } from "vitest";
import { normalizeUrl } from "../Pages/Admin/RichTextEditor";
import { withIds } from "../Pages/Admin/ui";

describe("normalizeUrl", () => {
  it.each([
    ["lewagon.com", "https://lewagon.com"],
    ["www.lewagon.com/fr/web-development-course", "https://www.lewagon.com/fr/web-development-course"],
    ["  https://example.com/page  ", "https://example.com/page"],
    ["http://example.com", "http://example.com"],
    ["jean@example.com", "mailto:jean@example.com"],
    ["/privacy-policy", "/privacy-policy"],
  ])("accepts %s", (input, expected) => {
    expect(normalizeUrl(input)).toBe(expected);
  });

  it.each(["", "javascript:alert(1)", "pas une adresse", "//evil.com"])("rejects %j", (input) => {
    expect(normalizeUrl(input)).toBeNull();
  });
});

describe("withIds", () => {
  it("keeps saved ids and derives new unique ones from the French title", () => {
    const result = withIds([
      { id: "frontend", title: { fr: "Front-End" } },
      { id: "", isNew: true, title: { fr: "Données & Visualisation" } },
      { id: "", isNew: true, title: { fr: "Front End" } },
      { id: "", isNew: true, title: { fr: "" } },
    ]);
    expect(result.map((item) => item.id)).toEqual(["frontend", "donnees-visualisation", "front-end", "element"]);
    expect(result.every((item) => !("isNew" in item))).toBe(true);
  });
});
