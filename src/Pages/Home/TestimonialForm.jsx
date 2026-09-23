import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { m } from "motion/react";
import { api } from "../../services/api";
import { StarIcon } from "../../components/Icons";

export default function TestimonialForm({ onClose }) {
  const { t, i18n } = useTranslation();
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const firstFieldRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    firstFieldRef.current?.focus();
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (formData.get("website")) {
      setStatus("sent");
      return;
    }
    setStatus("sending");
    try {
      await api("/testimonials", {
        method: "POST",
        body: {
          authorName: formData.get("author-name"),
          authorDesignation: formData.get("author-designation"),
          rating,
          message: formData.get("review"),
          lang: i18n.resolvedLanguage,
          consent: formData.get("review-consent") === "on",
        },
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <m.div
      className="fixed inset-0 z-70 flex items-center justify-center bg-ink/70 p-5 backdrop-blur-sm"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <m.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-title"
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-line bg-panel p-7 shadow-2xl"
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.25 }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("skills.close")}
          className="absolute top-4 right-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-line text-xl text-slate-300 hover:border-accent"
        >
          ×
        </button>
        <h2 id="review-title" className="mb-2 text-2xl font-bold text-white">
          {t("testimonials.form.title")}
        </h2>

        {status === "sent" ? (
          <div className="flex flex-col gap-5 pt-2">
            <p className="text-slate-300">{t("testimonials.form.thanks")}</p>
            <button type="button" className="btn-primary cursor-pointer self-start" onClick={onClose}>
              {t("skills.close")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="text-sm text-slate-400">{t("testimonials.form.intro")}</p>
            <label htmlFor="author-name" className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-300">
                {t("testimonials.form.name")} <span className="text-accent" aria-hidden="true">*</span>
              </span>
              <input ref={firstFieldRef} id="author-name" name="author-name" className="field" required minLength={2} maxLength={80} autoComplete="name" />
            </label>
            <label htmlFor="author-designation" className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-300">{t("testimonials.form.designation")}</span>
              <input id="author-designation" name="author-designation" className="field" maxLength={80} autoComplete="organization-title" />
            </label>
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-sm font-semibold text-slate-300">{t("testimonials.form.rating")}</legend>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    aria-pressed={value <= rating}
                    aria-label={t("testimonials.rating", { count: value })}
                    className={`cursor-pointer rounded-md p-1 transition-transform hover:scale-110 ${value <= rating ? "text-accent" : "text-slate-600"}`}
                  >
                    <StarIcon />
                  </button>
                ))}
              </div>
            </fieldset>
            <label htmlFor="review" className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-300">
                {t("testimonials.form.message")} <span className="text-accent" aria-hidden="true">*</span>
              </span>
              <textarea id="review" name="review" className="field h-32 resize-none" required minLength={10} maxLength={1000} />
            </label>
            <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="review-website">website</label>
              <input id="review-website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <label htmlFor="review-consent" className="flex items-start gap-3 text-sm text-slate-400">
              <input type="checkbox" id="review-consent" name="review-consent" required className="mt-1 h-4 w-4 accent-[var(--accent)]" />
              <span>{t("testimonials.form.consent")}</span>
            </label>
            {status === "error" && <p className="font-semibold text-red-400">{t("contact.form.error")}</p>}
            <button type="submit" disabled={status === "sending"} className="btn-primary cursor-pointer self-start disabled:opacity-60">
              {status === "sending" ? t("contact.form.submitting") : t("testimonials.form.submit")}
            </button>
          </form>
        )}
      </m.div>
    </m.div>
  );
}
