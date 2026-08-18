import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaArrowLeft,
  FaBook,
  FaDiscord,
  FaEnvelope,
  FaGithub,
  FaHouse,
  FaLinkedin,
  FaMagnifyingGlass,
  FaXTwitter,
  FaXmark,
} from "react-icons/fa6";
import { useSearch } from "../hooks/useSearch";
import { ThemeToggle } from "./ThemeToggle";

const contacts = [
  { label: "Email", href: "mailto:noahseeger@outlook.de", icon: FaEnvelope },
  { label: "GitHub", href: "https://github.com/NoahSeeger", icon: FaGithub },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/noahseeger/", icon: FaLinkedin },
  { label: "X", href: "https://x.com/thenoahsee", icon: FaXTwitter },
  { label: "Discord", href: "https://discord.com/users/noahsee", icon: FaDiscord },
];

export function PortfolioDock() {
  const [shineIteration, setShineIteration] = useState(0);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { openSearch } = useSearch();
  const isSearch = location.pathname === "/search";
  const isBlogPost = location.pathname.startsWith("/blog/");
  const isBlogIndex = location.pathname === "/blog";

  const navLink = isBlogPost ? "/blog" : isBlogIndex ? "/" : "/blog";
  const navLabel = isBlogPost ? t("posts_back") : isBlogIndex ? t("nav_home") : t("nav_blog");
  const navIcon = isBlogPost ? <FaArrowLeft /> : isBlogIndex ? <FaHouse /> : <FaBook />;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let timer;
    const scheduleShine = () => {
      const delay = 16000 + Math.random() * 14000;
      timer = window.setTimeout(() => {
        setShineIteration((iteration) => iteration + 1);
        scheduleShine();
      }, delay);
    };

    scheduleShine();
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <nav
        aria-label="Site navigation"
        className="portfolio-top-nav portfolio-top-nav-enter fixed right-5 top-5 z-[70] flex items-center gap-1 sm:right-7 sm:top-7"
      >
        <Link to={navLink} className="top-nav-control" aria-label={navLabel} title={navLabel}>
          {navIcon}
        </Link>

        <button
          type="button"
          className="top-nav-control"
          onClick={() => (isSearch ? navigate(-1) : openSearch())}
          aria-label={isSearch ? t("search_close", "Close search") : t("search_title", "Search")}
          title={isSearch ? t("search_close", "Close search") : t("search_title", "Search")}
        >
          <span key={isSearch ? "close" : "search"} className="nav-icon-swap">
            {isSearch ? <FaXmark /> : <FaMagnifyingGlass />}
          </span>
        </button>

        <ThemeToggle />
      </nav>

      <nav
        aria-label="Contact links"
        className="portfolio-dock portfolio-contact-dock portfolio-dock-enter fixed bottom-5 left-1/2 z-[70] flex items-center gap-1.5 px-2 py-2 sm:bottom-6 sm:gap-2 sm:px-2.5"
      >
        <span key={shineIteration} className="nav-edge-shine pointer-events-none absolute inset-0 rounded-full" aria-hidden="true" />
        {contacts.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="dock-control"
            aria-label={label}
            title={label}
          >
            <Icon aria-hidden="true" />
          </a>
        ))}
      </nav>
    </>
  );
}
