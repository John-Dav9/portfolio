import { z } from "zod";

const text = (max) => z.string().trim().max(max);
const bilingual = (max) => z.object({ fr: text(max), en: text(max) });
// Absolute https links, site-relative paths (/img, /uploads) or mailto.
const link = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^(https:\/\/|\/(?!\/)|mailto:)/i.test(v), "Lien invalide (https://, / ou mailto:)");
const id = z.string().trim().regex(/^[a-z0-9-]{1,40}$/, "Identifiant : minuscules, chiffres et tirets");

export const skill = z.object({
  id,
  focus: z.enum(["dev", "data", "both"]),
  tag: text(40),
  title: bilingual(80),
  tools: text(160),
  description: bilingual(1200),
});

export const project = z.object({
  id,
  domain: z.enum(["dev", "data"]),
  src: link,
  title: bilingual(100),
  description: bilingual(1500),
  repo: link,
  site: link,
  stack: z.array(text(30).min(1)).max(12).optional().default([]),
});

export const timelineStep = z.object({
  id,
  period: text(40).min(1),
  title: bilingual(100),
  detail: bilingual(300),
  url: link,
  kind: z.enum(["dev", "data", "other"]),
  current: z.boolean().optional().default(false),
});

export const site = z.object({
  siteUrl: link,
  owner: z.object({ name: text(100), location: bilingual(100).optional() }).passthrough(),
  hosting: z.object({ name: text(100), address: text(200), website: link }),
  hero: z.object({ subtitleSuffix: bilingual(80), ctaUrl: link, imageUrl: link }),
  about: z.object({ imageUrl: link }),
  githubUrl: link,
  socialLinks: z.object({ linkedin: link, github: link, facebook: link, instagram: link, twitter: link }),
});

const textBlock = z.record(z.string(), text(3000));
export const texts = z.object({ fr: textBlock, en: textBlock });

const cvSlot = z.string().regex(/^[a-f0-9]{16}\.pdf$/).nullable();
export const cv = z.object({
  dev: z.object({ fr: cvSlot, en: cvSlot }),
  data: z.object({ fr: cvSlot, en: cvSlot }),
});

export const contentSchemas = {
  site,
  skills: z.array(skill).max(40),
  projects: z.array(project).max(60),
  timeline: z.array(timelineStep).max(30),
  texts,
  cv,
};

const honeypot = z.string().max(0).optional().or(z.literal(""));

export const contactMessage = z.object({
  firstName: text(80).min(1),
  lastName: text(80).min(1),
  email: z.email().max(254),
  phone: text(40).optional().default(""),
  subject: text(80).min(1),
  message: text(5000).min(1),
  consent: z.literal(true),
  website: honeypot,
});

export const testimonialSubmission = z.object({
  authorName: text(80).min(2),
  authorDesignation: text(80).optional().default(""),
  rating: z.coerce.number().int().min(1).max(5),
  message: text(1000).min(10),
  lang: z.enum(["fr", "en"]),
  consent: z.literal(true),
  website: honeypot,
});

export const testimonialUpdate = z.object({
  status: z.enum(["pending", "approved"]).optional(),
  authorName: text(80).min(1).optional(),
  authorDesignation: bilingual(80).optional(),
  description: bilingual(1000).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  avatar: link.optional(),
});
