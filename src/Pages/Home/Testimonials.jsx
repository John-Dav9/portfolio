import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, m } from "motion/react";
import { useContent } from "../../components/ContentContext";
import TestimonialForm from "./TestimonialForm";
import { StarIcon } from "../../components/Icons";
import { localize } from "../../utils/localize";
import SectionHeading from "../../components/SectionHeading";
import { trackSpotlight } from "../../components/motion";

const INITIAL_COUNT = 3;

export default function Testimonial() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;
  const { testimonials } = useContent();
  const [showAll, setShowAll] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const closeForm = useCallback(() => setFormOpen(false), []);
  const visible = showAll ? testimonials : testimonials.slice(0, INITIAL_COUNT);

  return (
    <section id="testimonial" className="mx-auto max-w-7xl px-5 py-20 md:px-8">
      <SectionHeading index="04" title={t("testimonials.title")} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((item, index) => (
            <m.figure
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (index % INITIAL_COUNT) * 0.08 }}
              onPointerMove={trackSpotlight}
              className="spotlight flex flex-col gap-5 rounded-3xl p-7"
            >
              <div className="flex gap-1 text-accent" role="img" aria-label={t("testimonials.rating", { count: item.rating })}>
                {Array.from({ length: item.rating }, (_, star) => (
                  <StarIcon key={star} />
                ))}
              </div>
              <blockquote className="flex-1 leading-relaxed text-slate-300">“{localize(item.description, lang)}”</blockquote>
              <figcaption className="flex items-center gap-3">
                <img src={item.src} alt="" width="48" height="48" loading="lazy" className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-white">{item.author_name}</p>
                  <p className="text-sm text-slate-400">{localize(item.author_designation, lang)}</p>
                </div>
              </figcaption>
            </m.figure>
          ))}
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {testimonials.length > INITIAL_COUNT && (
          <button type="button" onClick={() => setShowAll(!showAll)} aria-expanded={showAll} className="btn-ghost cursor-pointer">
            {showAll ? t("testimonials.showLess") : t("testimonials.showAll", { count: testimonials.length })}
          </button>
        )}
        <button type="button" onClick={() => setFormOpen(true)} aria-haspopup="dialog" className="btn-primary cursor-pointer">
          {t("testimonials.leaveReview")}
        </button>
      </div>
      <AnimatePresence>{formOpen && <TestimonialForm onClose={closeForm} />}</AnimatePresence>
    </section>
  );
}
