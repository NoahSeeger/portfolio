import { useEffect, useRef } from "react";

export function SiteFooter() {
  const wordmarkRef = useRef(null);
  useEffect(() => {
    if (!wordmarkRef.current || !window.IntersectionObserver) return undefined;
    const root = document.documentElement;
    const observer = new window.IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) root.dataset.footerWordmark = "";
      else delete root.dataset.footerWordmark;
    });
    observer.observe(wordmarkRef.current);
    return () => { observer.disconnect(); delete root.dataset.footerWordmark; };
  }, []);

  return (
    <footer className="portfolio-site-footer">
      <div ref={wordmarkRef} className="portfolio-footer-wordmark" aria-hidden="true"><span>SEEGER</span></div>
    </footer>
  );
}
