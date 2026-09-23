import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import siteContent from "../../data/site.json";
import SectionLink from "../../components/SectionLink";
import { SocialIcon } from "../../components/Icons";
import { SECTIONS } from "../../utils/sections";

const SOCIAL_LABELS = {
  linkedin: "LinkedIn",
  github: "GitHub",
  facebook: "Facebook",
  instagram: "Instagram",
  twitter: "X (Twitter)",
};

const LEGAL_LINKS = [
  { to: "/legal-notice", labelKey: "legal.legalNotice" },
  { to: "/privacy-policy", labelKey: "legal.privacyPolicy" },
  { to: "/terms-of-service", labelKey: "legal.termsOfService" },
  { to: "/cookies-settings", labelKey: "legal.cookieSettings" },
];

function Footer() {
  const { t } = useTranslation();
  const socialLinks = Object.entries(siteContent.socialLinks).filter(([, url]) => url);

  return (
    <footer className="footer--container">
      <div className="footer--link--container">
        <div>
          <img src="/img/logo.webp" alt={t("navbar.logoAlt")} width="45" height="45" loading="lazy" />
        </div>
        <div className="footer--items">
          <ul>
            {SECTIONS.map(({ id, labelKey }) => (
              <li key={id}>
                <SectionLink to={id} className="text-md">
                  {t(labelKey)}
                </SectionLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer--social--icon">
          <ul aria-label={t("footer.social")}>
            {socialLinks.map(([name, url]) => (
              <li key={name}>
                <a href={url} target="_blank" rel="noreferrer" aria-label={SOCIAL_LABELS[name]}>
                  <SocialIcon name={name} size={name === "github" ? 18 : 32} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <hr className="divider" />
      <div className="footer--content--container">
        <p className="footer--content">{t("footer.copyright", { year: new Date().getFullYear() })}</p>
        <p className="footer--content">{t("footer.dedication")}</p>
        <div className="footer--social--icon">
          <ul>
            {LEGAL_LINKS.map(({ to, labelKey }) => (
              <li key={to}>
                <RouterLink to={to} className="text-sm">
                  {t(labelKey)}
                </RouterLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
