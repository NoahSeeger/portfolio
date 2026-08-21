import { useTranslation } from "react-i18next";

export function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="portfolio-site-footer">
      <div className="portfolio-site-footer-main">
        <p>
          {t(
            "home_footer_note",
            "A small place for projects, experiments, and notes to my future self.",
          )}
        </p>
        <nav aria-label="Footer navigation" className="portfolio-site-footer-links">
          <a href="https://picswipe.noahseeger.de" target="_blank" rel="noopener noreferrer">
            PicSwipe
          </a>
          <a href="/blog">{t("footer_blog", "Blog")}</a>
        </nav>
      </div>
      <div className="portfolio-site-footer-bottom">
        <span>© {new Date().getFullYear()} Noah Seeger</span>
        <span>Made with curiosity.</span>
      </div>
    </footer>
  );
}
