import { describe, expect, it } from "vitest";
import { sanitizeRichText } from "../utils/richText";

describe("sanitizeRichText", () => {
  it("keeps allowed tags and safe links, opening external ones in a new tab", () => {
    const html = sanitizeRichText('Hi <strong>there</strong> <a href="https://example.com">link</a>');
    expect(html).toBe('Hi <strong>there</strong> <a href="https://example.com" target="_blank" rel="noreferrer">link</a>');
  });

  it("does not force a new tab on internal links", () => {
    expect(sanitizeRichText('<a href="/privacy-policy">p</a>')).toBe('<a href="/privacy-policy">p</a>');
  });

  it("strips scripts, event handlers and javascript: URLs", () => {
    const html = sanitizeRichText(
      '<img src=x onerror="alert(1)"><script>alert(2)</script><a href="javascript:alert(3)" onclick="x()">click</a>'
    );
    expect(html).not.toMatch(/onerror|onclick|javascript:|<script|<img/i);
    expect(html).toContain(">click</a>");
  });
});
