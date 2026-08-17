import React, { useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
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
import DeFlag from "../assets/de.svg";
import UsFlag from "../assets/us.svg";
import { setUserLang } from "../i18n";

const contacts = [
  { label: "Email", href: "mailto:noahseeger@outlook.de", icon: FaEnvelope },
  { label: "GitHub", href: "https://github.com/NoahSeeger", icon: FaGithub },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/noahseeger/", icon: FaLinkedin },
  { label: "X", href: "https://x.com/thenoahsee", icon: FaXTwitter },
  { label: "Discord", href: "https://discord.com/users/noahsee", icon: FaDiscord },
];

export function PortfolioDock() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { openSearch } = useSearch();
  const isSearch = location.pathname === "/search";
  const isBlogPost = location.pathname.startsWith("/blog/");
  const isBlogIndex = location.pathname === "/blog";

  const handleLangToggle = useCallback(() => {
    const nextLanguage = i18n.language === "de" ? "en" : "de";
    i18n.changeLanguage(nextLanguage);
    setUserLang(nextLanguage);
  }, [i18n]);

  const navLink = isBlogPost ? "/blog" : isBlogIndex ? "/" : "/blog";
  const navLabel = isBlogPost ? t("posts_back") : isBlogIndex ? t("nav_home") : t("nav_blog");
  const navIcon = isBlogPost ? <FaArrowLeft /> : isBlogIndex ? <FaHouse /> : <FaBook />;

  return (
    <>
      <motion.nav
        aria-label="Site navigation"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
        className="portfolio-top-nav fixed right-5 top-5 z-[70] flex items-center gap-1 sm:right-7 sm:top-7"
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
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isSearch ? "close" : "search"}
              initial={{ opacity: 0, scale: 0.55, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.55, rotate: 45 }}
              transition={{ duration: 0.16 }}
            >
              {isSearch ? <FaXmark /> : <FaMagnifyingGlass />}
            </motion.span>
          </AnimatePresence>
        </button>

        <ThemeToggle />

        <button type="button" className="top-nav-language" onClick={handleLangToggle} aria-label="Toggle language" title="Toggle language">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={i18n.language}
              src={i18n.language === "de" ? DeFlag : UsFlag}
              alt=""
              className="h-4 w-6 object-cover"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
            />
          </AnimatePresence>
        </button>
      </motion.nav>

      <motion.nav
        aria-label="Contact links"
        initial={{ opacity: 0, y: 60, scale: 0.8, x: "-50%" }}
        animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
        transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.15 }}
        className="portfolio-dock portfolio-contact-dock fixed bottom-5 left-1/2 z-[70] flex items-center gap-1.5 px-2 py-2 sm:bottom-6 sm:gap-2 sm:px-2.5"
      >
        <span className="nav-edge-shine pointer-events-none absolute inset-0 rounded-full" aria-hidden="true" />
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
      </motion.nav>
    </>
  );
}
