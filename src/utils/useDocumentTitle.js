import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function useDocumentTitle(pageTitle) {
  const { t } = useTranslation();
  const siteTitle = t("meta.title");

  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} | John David Tchomgui` : siteTitle;
  }, [pageTitle, siteTitle]);
}
