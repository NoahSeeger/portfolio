import React, { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "./ThemeToggle";
import { FaMagnifyingGlass, FaArrowLeft } from "react-icons/fa6";
import { FaHome, FaBook } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "../hooks/useSearch";
import DeFlag from "../assets/de.svg";
import UsFlag from "../assets/us.svg";

export function FloatingNav() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { openSearch } = useSearch();
  const isBlogPost = location.pathname.startsWith("/blog/");
  const isBlogIndex = location.pathname === "/blog";

  const handleLangToggle = useCallback(() => {
    const newLang = i18n.language === "de" ? "en" : "de";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-6 z-50 w-full px-6 sm:px-8 lg:px-12"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
      {/* Left side: Nav + Search */}
      <div className="flex items-center gap-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to={getNavLink()}
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
            aria-label={getNavLabel()}
          >
            {getNavIcon()}
          </Link>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openSearch}
          className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
          aria-label="Search"
        >
          <FaMagnifyingGlass size={18} style={{ color: "var(--text-primary)" }} />
        </motion.button>
      </div>

      {/* Right side: Theme + Language */}
      <div className="flex items-center gap-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ThemeToggle />
        </motion.div>

        <motion.button
          onClick={handleLangToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-11 h-11 rounded-full overflow-hidden"
          style={{
            backgroundColor: "var(--accent)",
            border: "1px solid transparent"
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
        </motion.button>
      </div>
      </div>
    </motion.div>
  );
}