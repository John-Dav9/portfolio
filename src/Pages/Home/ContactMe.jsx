import { useState } from "react";
import { useTranslation } from "react-i18next";
import emailjs from "@emailjs/browser";
import siteContent from "../../data/site.json";
import { COUNTRY_CODES } from "../../data/countryCodes";
import SectionHeading from "../../components/SectionHeading";
import { SocialIcon } from "../../components/Icons";
import { Reveal, trackSpotlight } from "../../components/motion";

const CONTACT_LINKS = [
  { name: "linkedin", url: siteContent.socialLinks.linkedin, label: "LinkedIn" },
  { name: "github", url: siteContent.socialLinks.github, label: "GitHub" },
].filter((link) => link.url);

// EmailJS IDs are public by design; restrict allowed origins in the EmailJS dashboard.
// VITE_EMAILJS_* variables override the values from site.json at build time.
const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || siteContent.emailjs.serviceId,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || siteContent.emailjs.templateId,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || siteContent.emailjs.publicKey,
};

const DEFAULT_COUNTRY = "FRA";
const SUBJECTS = [
  { value: "Freelance", labelKey: "contact.form.freelance" },
  { value: "Collaboration", labelKey: "contact.form.collaboration" },
  { value: "Emploi", labelKey: "contact.form.job" },
  { value: "Autres", labelKey: "contact.form.other" },
];

function RequiredMark() {
  return <span className="text-accent" aria-hidden="true"> *</span>;
}

export default function ContactMe() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [phoneNumber, setPhoneNumber] = useState("");

  const showStatus = (status) => {
    setSubmitStatus(status);
    setTimeout(() => setSubmitStatus(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    // Honeypot: bots fill every field; humans never see this one.
    if (formData.get("website")) {
      form.reset();
      showStatus("success");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const dialCode = COUNTRY_CODES.find((item) => item.countryCode === country)?.code ?? "";
    const email = formData.get("email");

    try {
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        {
          from_name: `${formData.get("first-name")} ${formData.get("last-name")}`,
          from_email: email,
          phone_number: phoneNumber ? `${dialCode} ${phoneNumber}` : "—",
          subject: formData.get("choose-subject") || "Nouveau message de contact",
          message: formData.get("message"),
          to_name: "John David",
          reply_to: email,
          submission_date: new Date().toLocaleString("fr-FR", { dateStyle: "full", timeStyle: "short" }),
        },
        { publicKey: EMAILJS_CONFIG.publicKey }
      );
      form.reset();
      setCountry(DEFAULT_COUNTRY);
      setPhoneNumber("");
      showStatus("success");
    } catch (error) {
      console.error("EmailJS error:", error);
      showStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="Contact" className="mx-auto max-w-7xl px-5 py-20 md:px-8">
      <SectionHeading index="05" title={t("contact.title")} />
      <div className="grid gap-10 lg:grid-cols-12">
        <Reveal className="flex flex-col gap-6 rounded-3xl border border-line bg-panel/50 p-6 sm:p-8 lg:col-span-4">
          <div className="flex items-center gap-2.5 self-start rounded-full border border-line bg-ink/60 px-3.5 py-2 text-sm text-slate-300">
            <span className="h-2 w-2 animate-pulse-ring rounded-full bg-data" />
            {t("hero.status")}
          </div>
          <p className="text-lg leading-relaxed text-slate-300">{t("contact.description")}</p>
          <div className="flex flex-col gap-3">
            <p className="font-mono text-sm text-slate-400">{t("contact.topics")}</p>
            <ul className="flex flex-wrap gap-2">
              {SUBJECTS.slice(0, 3).map(({ value, labelKey }) => (
                <li key={value} className="rounded-full border border-line px-3 py-1.5 text-sm text-slate-300">
                  {t(labelKey)}
                </li>
              ))}
            </ul>
          </div>
          <ul className="mt-auto flex flex-col gap-3">
            {CONTACT_LINKS.map(({ name, url, label }) => (
              <li key={name}>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  onPointerMove={trackSpotlight}
                  className="spotlight flex items-center gap-3 rounded-2xl px-5 py-4 font-semibold text-slate-200"
                >
                  <SocialIcon name={name} size={name === "github" ? 20 : 26} />
                  {label}
                  <span className="ml-auto text-accent" aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="flex h-full flex-col gap-5 rounded-3xl border border-line bg-panel/80 p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label htmlFor="first-name" className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-300">
                  {t("contact.form.firstName")}
                  <RequiredMark />
                </span>
                <input className="field" type="text" name="first-name" id="first-name" placeholder={t("contact.form.firstName")} autoComplete="given-name" required />
              </label>
              <label htmlFor="last-name" className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-300">
                  {t("contact.form.lastName")}
                  <RequiredMark />
                </span>
                <input className="field" type="text" name="last-name" id="last-name" placeholder={t("contact.form.lastName")} autoComplete="family-name" required />
              </label>
              <label htmlFor="email" className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-300">
                  {t("contact.form.email")}
                  <RequiredMark />
                </span>
                <input className="field" type="email" name="email" id="email" placeholder={t("contact.form.email")} autoComplete="email" required />
              </label>
              <div className="flex flex-col gap-2">
                <label htmlFor="phone-number" className="text-sm font-semibold text-slate-300">
                  {t("contact.form.phone")}
                </label>
                <div className="grid grid-cols-[124px_1fr] gap-2">
                  <select className="field" value={country} onChange={(e) => setCountry(e.target.value)} aria-label={t("contact.form.countryCode")}>
                    {COUNTRY_CODES.map((item) => (
                      <option key={item.countryCode} value={item.countryCode}>
                        {item.flag} {item.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    className="field"
                    id="phone-number"
                    placeholder={t("contact.form.phonePlaceholder")}
                    autoComplete="tel-national"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
              </div>
            </div>
            <label htmlFor="choose-subject" className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-300">
                {t("contact.form.subject")}
                <RequiredMark />
              </span>
              <select id="choose-subject" name="choose-subject" className="field" required>
                <option value="">{t("contact.form.selectTopic")}</option>
                {SUBJECTS.map(({ value, labelKey }) => (
                  <option key={value} value={value}>
                    {t(labelKey)}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="message" className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-300">
                {t("contact.form.message")}
                <RequiredMark />
              </span>
              <textarea className="field resize-y" id="message" name="message" rows="6" placeholder={t("contact.form.message")} required />
            </label>
            <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="website">{t("contact.form.honeypot")}</label>
              <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <label htmlFor="consent" className="flex items-start gap-3 text-sm text-slate-400">
              <input type="checkbox" required name="consent" id="consent" className="mt-1 h-4 w-4 accent-[var(--accent)]" />
              <span className="rich">
                {t("contact.form.consentBefore")}
                <a href="/privacy-policy" target="_blank" rel="noreferrer">
                  {t("contact.form.consentLink")}
                </a>
                .
                <RequiredMark />
              </span>
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" className="btn-primary cursor-pointer disabled:cursor-wait disabled:opacity-60" disabled={isSubmitting}>
                {isSubmitting ? t("contact.form.submitting") : t("contact.form.submit")}
              </button>
              <div aria-live="polite">
                {submitStatus === "success" && <p className="font-semibold text-data">✓ {t("contact.form.success")}</p>}
                {submitStatus === "error" && <p className="font-semibold text-red-400">✗ {t("contact.form.error")}</p>}
              </div>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
