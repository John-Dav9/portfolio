import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SectionLink from "../../components/SectionLink";
import { SECTIONS } from "../../utils/sections";

const LANGUAGES = [
  { code: "fr", label: "FR", title: "Français" },
  { code: "en", label: "EN", title: "English" },
];

function Navbar() {
  const [navActive, setNavActive] = useState(false);
  const { t, i18n } = useTranslation();

  const closeMenu = () => setNavActive(false);

  useEffect(() => {
    window.addEventListener("resize", closeMenu);
    return () => window.removeEventListener("resize", closeMenu);
  }, []);

  return (
    <nav className={`navbar ${navActive ? "active" : ""}`}>
      <RouterLink to="/" className="navbar__logo" onClick={closeMenu}>
        <img src="/img/logo.webp" alt={t("navbar.logoAlt")} width="60" height="60" />
      </RouterLink>
      <button
        type="button"
        className={`nav__hamburger ${navActive ? "active" : ""}`}
        onClick={() => setNavActive((current) => !current)}
        aria-label={t("navbar.toggle")}
        aria-expanded={navActive}
        aria-controls="primary-navigation"
      >
        <span className="nav__hamburger__line"></span>
        <span className="nav__hamburger__line"></span>
        <span className="nav__hamburger__line"></span>
      </button>
      <div id="primary-navigation" className={`navbar--items ${navActive ? "active" : ""}`}>
        <ul>
          {SECTIONS.map(({ id, labelKey }) => (
            <li key={id}>
              <SectionLink to={id} className="navbar--content" onClick={closeMenu}>
                {t(labelKey)}
              </SectionLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar--actions">
        <div className="language--toggle" role="group" aria-label={t("navbar.language")}>
          {LANGUAGES.map(({ code, label, title }) => (
            <button
              key={code}
              type="button"
              onClick={() => i18n.changeLanguage(code)}
              className={`lang--btn ${i18n.resolvedLanguage === code ? "active" : ""}`}
              aria-pressed={i18n.resolvedLanguage === code}
              title={title}
              lang={code}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
