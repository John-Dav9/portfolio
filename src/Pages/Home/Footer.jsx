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
    <footer className="mt-10 border-t border-line bg-ink/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 md:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <RouterLink to="/" className="font-mono text-[15px] font-semibold text-slate-100">
            <span className="text-accent">~/</span>jd-tchomgui
          </RouterLink>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
            {SECTIONS.map(({ id, labelKey }) => (
              <li key={id}>
                <SectionLink to={id} className="hover:text-white">
                  {t(labelKey)}
                </SectionLink>
              </li>
            ))}
          </ul>
          <ul aria-label={t("footer.social")} className="flex gap-3">
            {socialLinks.map(([name, url]) => (
              <li key={name}>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={SOCIAL_LABELS[name]}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-slate-300 transition-colors hover:border-accent hover:text-accent"
                >
                  <SocialIcon name={name} size={name === "github" ? 18 : 26} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4 border-t border-line pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
          <p>{t("footer.dedication")}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL_LINKS.map(({ to, labelKey }) => (
              <li key={to}>
                <RouterLink to={to} className="hover:text-white">
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
