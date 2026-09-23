import { useState } from "react";
import { useTranslation } from "react-i18next";
import emailjs from "@emailjs/browser";
import siteContent from "../../data/site.json";
import { COUNTRY_CODES } from "../../data/countryCodes";

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
  return <span className="required-asterisk" aria-hidden="true"> *</span>;
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
    <section id="Contact" className="contact--section">
      <div>
        <h2>{t("contact.title")}</h2>
        <p className="text-lg">{t("contact.description")}</p>
      </div>
      <form onSubmit={handleSubmit} className="contact--form--container">
        <div className="container">
          <label htmlFor="first-name" className="contact--label required">
            <span className="text-md">
              {t("contact.form.firstName")}
              <RequiredMark />
            </span>
            <input
              type="text"
              className="contact--input text-md"
              name="first-name"
              id="first-name"
              placeholder={t("contact.form.firstName")}
              autoComplete="given-name"
              required
            />
          </label>
          <label htmlFor="last-name" className="contact--label required">
            <span className="text-md">
              {t("contact.form.lastName")}
              <RequiredMark />
            </span>
            <input
              type="text"
              className="contact--input text-md"
              name="last-name"
              id="last-name"
              placeholder={t("contact.form.lastName")}
              autoComplete="family-name"
              required
            />
          </label>
          <label htmlFor="email" className="contact--label required">
            <span className="text-md">
              {t("contact.form.email")}
              <RequiredMark />
            </span>
            <input
              type="email"
              className="contact--input text-md"
              name="email"
              id="email"
              placeholder={t("contact.form.email")}
              autoComplete="email"
              required
            />
          </label>
          <div className="contact--label">
            <label htmlFor="phone-number">
              <span className="text-md">{t("contact.form.phone")}</span>
            </label>
            <div className="phone--input--container">
              <select
                className="contact--input contact--input--country text-md"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                aria-label={t("contact.form.countryCode")}
              >
                {COUNTRY_CODES.map((item) => (
                  <option key={item.countryCode} value={item.countryCode}>
                    {item.flag} {item.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                className="contact--input contact--input--number text-md"
                id="phone-number"
                placeholder={t("contact.form.phone")}
                autoComplete="tel-national"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          </div>
        </div>
        <label htmlFor="choose-subject" className="contact--label required">
          <span className="text-md">
            {t("contact.form.subject")}
            <RequiredMark />
          </span>
          <select id="choose-subject" name="choose-subject" className="contact--input text-md" required>
            <option value="">{t("contact.form.selectTopic")}</option>
            {SUBJECTS.map(({ value, labelKey }) => (
              <option key={value} value={value}>
                {t(labelKey)}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="message" className="contact--label required">
          <span className="text-md">
            {t("contact.form.message")}
            <RequiredMark />
          </span>
          <textarea
            className="contact--input text-md"
            id="message"
            name="message"
            rows="8"
            placeholder={t("contact.form.message")}
            required
          />
        </label>
        <div className="contact--honeypot" aria-hidden="true">
          <label htmlFor="website">{t("contact.form.honeypot")}</label>
          <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <label htmlFor="consent" className="checkbox--label required">
          <input type="checkbox" required name="consent" id="consent" />
          <span className="text-sm">
            {t("contact.form.consentBefore")}
            <a href="/privacy-policy" target="_blank" rel="noreferrer">
              {t("contact.form.consentLink")}
            </a>
            .
            <RequiredMark />
          </span>
        </label>
        <div>
          <button type="submit" className="btn btn-primary contact--form--btn" disabled={isSubmitting}>
            {isSubmitting ? t("contact.form.submitting") : t("contact.form.submit")}
          </button>
          <div aria-live="polite">
            {submitStatus === "success" && (
              <p className="form--message form--message--success">✓ {t("contact.form.success")}</p>
            )}
            {submitStatus === "error" && (
              <p className="form--message form--message--error">✗ {t("contact.form.error")}</p>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}
