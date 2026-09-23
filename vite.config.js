import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const { siteUrl: configuredSiteUrl } = JSON.parse(readFileSync("./src/data/site.json", "utf8"));
const siteUrl = (process.env.SITE_URL || configuredSiteUrl || "").replace(/\/$/, "");
const PAGES = ["/", "/legal-notice", "/privacy-policy", "/terms-of-service", "/cookies-settings"];

// Absolute URLs (canonical, og:url, sitemap) need the public domain: set "siteUrl" in
// src/data/site.json or the SITE_URL env variable. Without it they are simply omitted.
function siteUrlPlugin() {
  return {
    name: "site-url",
    transformIndexHtml(html) {
      const meta = siteUrl
        ? `<link rel="canonical" href="${siteUrl}/" />\n    <meta property="og:url" content="${siteUrl}/" />`
        : "";
      return html.replaceAll("%SITE_URL%", siteUrl).replace("<!-- site-url-meta -->", meta);
    },
    generateBundle() {
      const robots = ["User-agent: *", "Allow: /", "Disallow: /admin"];
      if (siteUrl) {
        robots.push(`Sitemap: ${siteUrl}/sitemap.xml`);
        const urls = PAGES.map((page) => `  <url><loc>${siteUrl}${page}</loc></url>`).join("\n");
        this.emitFile({
          type: "asset",
          fileName: "sitemap.xml",
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        });
      }
      this.emitFile({ type: "asset", fileName: "robots.txt", source: robots.join("\n") + "\n" });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteUrlPlugin()],
  build: {
    outDir: "build",
  },
  server: {
    proxy: { "/api": "http://localhost:3001", "/uploads": "http://localhost:3001" },
  },
  preview: {
    proxy: { "/api": "http://localhost:3001", "/uploads": "http://localhost:3001" },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.js"],
    css: false,
    include: ["src/**/*.test.{js,jsx}"],
  },
});
