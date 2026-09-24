import { useEffect, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, m } from "motion/react";
import SectionLink from "../../components/SectionLink";
import FocusSwitch from "../../components/FocusSwitch";
import { SECTIONS } from "../../utils/sections";

const LANGUAGES = [
  { code: "fr", label: "FR", title: "Français" },
  { code: "en", label: "EN", title: "English" },
];

// Highlights the nav link of the section currently in the middle of the viewport.
function useActiveSection(enabled) {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [enabled]);

  return enabled ? active : null;
}

function LanguageToggle() {
  const { t, i18n } = useTranslation();
  return (
    <div role="group" aria-label={t("navbar.language")} className="flex rounded-lg border border-line p-1 font-mono text-xs">
      {LANGUAGES.map(({ code, label, title }) => {
        const active = i18n.resolvedLanguage === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => i18n.changeLanguage(code)}
            aria-pressed={active}
            title={title}
            lang={code}
            className={`cursor-pointer rounded-md px-2.5 py-1.5 font-semibold transition-colors ${
              active ? "bg-slate-100 text-ink" : "text-slate-400 hover:text-slate-100"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

function Navbar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(pathname === "/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background,border-color,backdrop-filter] duration-300 ${
        scrolled || menuOpen ? "border-b border-line bg-ink/80 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
        <RouterLink to="/" onClick={closeMenu} className="font-mono text-[15px] font-semibold text-slate-100">
          john-d<span className="text-accent transition-colors duration-500">.dev</span>
        </RouterLink>

        <ul className="hidden items-center gap-1 rounded-full border border-line bg-panel/70 p-1.5 text-sm lg:flex">
          {SECTIONS.slice(1).map(({ id, labelKey }) => (
            <li key={id}>
              <SectionLink
                to={id}
                aria-current={active === id ? "true" : undefined}
                className={`block rounded-full px-4 py-2 transition-colors ${
                  active === id ? "bg-slate-100/10 text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                {t(labelKey)}
              </SectionLink>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <div className="hidden items-center gap-3 md:flex">
            <FocusSwitch />
            <LanguageToggle />
          </div>

          <button
          type="button"
          className="flex h-11 w-11 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-line lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={t("navbar.toggle")}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          <span className={`h-0.5 w-5 bg-slate-100 transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-5 bg-slate-100 transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-5 bg-slate-100 transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <m.div
            id="mobile-navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-line lg:hidden"
          >
            <div className="flex flex-col gap-6 px-5 py-6">
              <ul className="flex flex-col gap-1">
                {SECTIONS.map(({ id, labelKey }) => (
                  <li key={id}>
                    <SectionLink to={id} onClick={closeMenu} className="block rounded-lg px-3 py-3 text-lg text-slate-200 hover:bg-panel">
                      {t(labelKey)}
                    </SectionLink>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between gap-3 md:hidden">
                <FocusSwitch />
                <LanguageToggle />
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
