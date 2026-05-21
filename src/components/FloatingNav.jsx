import React, { useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "./ThemeToggle";
import { FaMagnifyingGlass, FaArrowLeft, FaXmark } from "react-icons/fa6";
import { FaHome, FaBook } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "../hooks/useSearch";
import DeFlag from "../assets/de.svg";
import UsFlag from "../assets/us.svg";
import { setUserLang } from "../i18n";

export function FloatingNav() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { openSearch } = useSearch();
  const isSearch = location.pathname === "/search";
  const isBlogPost = location.pathname.startsWith("/blog/");
  const isBlogIndex = location.pathname === "/blog";

  const handleLangToggle = useCallback(() => {
    const newLang = i18n.language === "de" ? "en" : "de";
    i18n.changeLanguage(newLang);
    setUserLang(newLang);
  }, [i18n]);

  const getNavIcon = () => {
    if (isBlogPost) return <FaArrowLeft size={20} style={{ color: "var(--text-primary)" }} />;
    if (isBlogIndex) return <FaHome size={20} style={{ color: "var(--text-primary)" }} />;
    return <FaBook size={20} style={{ color: "var(--text-primary)" }} />;
  };

  const getNavLink = () => {
    if (isBlogPost) return "/blog";
    if (isBlogIndex) return "/";
    return "/blog";
  };

  const getNavLabel = () => {
    if (isBlogPost) return t("posts_back");
    if (isBlogIndex) return t("nav_home");
    return t("nav_blog");
  };

  const navItem = {
    hidden: { y: -60, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] pt-4 md:pt-6">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            variants={navItem}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0 }}
            className="w-11 h-11"
          >
            <Link
              to={getNavLink()}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
              aria-label={getNavLabel()}
            >
              {getNavIcon()}
            </Link>
          </motion.div>

          <motion.div
            variants={navItem}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
            className="w-11 h-11"
          >
            <button
              onClick={() => isSearch ? navigate(-1) : openSearch()}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
              aria-label={isSearch ? "Close search" : "Search"}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSearch ? "x" : "search"}
                  initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="flex items-center justify-center"
                >
                  {isSearch ? (
                    <FaXmark size={18} style={{ color: "var(--text-primary)" }} />
                  ) : (
                    <FaMagnifyingGlass size={18} style={{ color: "var(--text-primary)" }} />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>
          </motion.div>
        </div>

        <div className="flex items-center gap-2">
          <motion.div
            variants={navItem}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
            className="w-11 h-11"
          >
            <ThemeToggle />
          </motion.div>

          <motion.div
            variants={navItem}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
            className="w-11 h-11"
          >
            <button
              onClick={handleLangToggle}
              className="relative w-11 h-11 rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95"
              style={{
                backgroundColor: "var(--accent)"
              }}
              aria-label="Toggle language"
            >
              <AnimatePresence mode="sync">
                <motion.img
                  key={i18n.language + "-exit"}
                  src={i18n.language === "de" ? UsFlag : DeFlag}
                  className="absolute inset-0 w-full h-full object-cover select-none"
                  style={{ transform: "scale(1.5)", zIndex: 1, pointerEvents: "none" }}
                  initial={{ x: 0, opacity: 1 }}
                  animate={{ x: i18n.language === "de" ? -40 : 40, opacity: 1 }}
                  exit={{ x: i18n.language === "de" ? -40 : 40, opacity: 1 }}
                  transition={{ duration: 0.12, ease: "linear" }}
                />
                <motion.img
                  key={i18n.language + "-enter"}
                  src={i18n.language === "de" ? DeFlag : UsFlag}
                  className="absolute inset-0 w-full h-full object-cover select-none"
                  style={{ transform: "scale(1.5)", zIndex: 2, pointerEvents: "none" }}
                  initial={{ x: i18n.language === "de" ? 40 : -40, opacity: 1 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: i18n.language === "de" ? 40 : -40, opacity: 1 }}
                  transition={{ duration: 0.12, ease: "linear" }}
                />
              </AnimatePresence>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}