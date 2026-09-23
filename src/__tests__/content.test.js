import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import data from "../data/index.json";
import site from "../data/site.json";
import en from "../locales/en.json";
import fr from "../locales/fr.json";
import { LEGAL_CONTENT } from "../Pages/Legal/content";
import { COUNTRY_CODES } from "../data/countryCodes";

const flatKeys = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([key, value]) =>
    typeof value === "object" ? flatKeys(value, `${prefix}${key}.`) : [`${prefix}${key}`]
  );

const publicFile = (path) => resolve(__dirname, "../../public", path.replace(/^\//, ""));
const bilingual = (value) => typeof value?.fr === "string" && value.fr && typeof value?.en === "string" && value.en;

describe("translations", () => {
  it("fr and en define the same keys", () => {
    expect(flatKeys(en).sort()).toEqual(flatKeys(fr).sort());
  });

  it("every legal page exists in both languages", () => {
    for (const page of Object.values(LEGAL_CONTENT)) {
      expect(page.fr.sections.length).toBe(page.en.sections.length);
    }
  });
});

describe("content data", () => {
  const entries = [
    ...data.skills.map((item) => ["skill", item]),
    ...data.portfolio.map((item) => ["project", item]),
  ];

  it.each(entries)("%s %# has bilingual title/description and an existing image", (_, item) => {
    expect(bilingual(item.title)).toBeTruthy();
    expect(bilingual(item.description)).toBeTruthy();
    expect(existsSync(publicFile(item.src))).toBe(true);
  });

  it("projects declare a known domain and clean https links", () => {
    for (const project of data.portfolio) {
      expect(["dev", "data"]).toContain(project.domain);
      for (const url of [project.repo, project.site].filter(Boolean)) {
        expect(url).toMatch(/^https:\/\/\S+$/);
      }
    }
  });

  it("testimonials are bilingual with a valid rating and avatar", () => {
    for (const item of data.testimonials) {
      expect(bilingual(item.description)).toBeTruthy();
      expect(item.rating).toBeGreaterThanOrEqual(1);
      expect(item.rating).toBeLessThanOrEqual(5);
      expect(existsSync(publicFile(item.src))).toBe(true);
    }
  });

  it("site images exist and ids are unique", () => {
    expect(existsSync(publicFile(site.hero.imageUrl))).toBe(true);
    expect(existsSync(publicFile(site.about.imageUrl))).toBe(true);
    for (const list of [data.skills, data.portfolio, data.testimonials, COUNTRY_CODES]) {
      const ids = list.map((item) => item.id ?? item.countryCode);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});
