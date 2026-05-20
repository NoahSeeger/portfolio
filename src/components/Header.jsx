import React, { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "./ThemeToggle";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import DeFlag from "../assets/de.svg";
import UsFlag from "../assets/us.svg";

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.08 } }
};

function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLangToggle = useCallback(() => {
    const newLang = i18n.language === "de" ? "en" : "de";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
  }, [i18n]);

  const currentFlag = i18n.language === "de" ? DeFlag : UsFlag;

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className="sticky top-0 z-50 w-full backdrop-blur-md"
      style={{ backgroundColor: "var(--bg-glass)" }}
    >
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Name */}
          <motion.div
            variants={staggerContainer}
            className="flex items-center gap-2"
          >
            <Link
              to="/"
              className="relative group"
            >
              <span
                className="text-xl font-bold tracking-tight transition-opacity duration-200 group-hover:opacity-60"
                style={{ color: "var(--text-primary)" }}
              >
                Noah Seeger
              </span>
              <span
                className="absolute -bottom-0.5 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                style={{ backgroundColor: "var(--accent)" }}
              />
            </Link>
          </motion.div>

          {/* Right: Blog, Search, Theme, Lang */}
          <motion.nav
            variants={staggerContainer}
            className="flex items-center gap-1"
          >
            <Link
              to="/blog"
              className="group relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200"
              style={{ color: "var(--text-primary)" }}
            >
              <span className="relative z-10">{t("nav_blog")}</span>
              <span
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ backgroundColor: "var(--bg-tertiary)" }}
              />
              <span
                className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-4/5"
                style={{ backgroundColor: "var(--accent)" }}
              />
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/search")}
              className="p-2.5 rounded-full transition-all duration-200"
              style={{ color: "var(--text-secondary)" }}
              aria-label="Search"
            >
              <FaMagnifyingGlass size={18} />
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ThemeToggle />
            </motion.div>

            <motion.button
              onClick={handleLangToggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-10 h-10 rounded-full overflow-hidden"
              style={{
                backgroundColor: "var(--accent)",
                border: "2px solid transparent"
              }}
              aria-label="Toggle language"
            >
              <AnimatePresence mode="sync">
                <motion.img
                  key={i18n.language + "-exit"}
                  src={i18n.language === "de" ? UsFlag : DeFlag}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ transform: "scale(1.5)", zIndex: 1 }}
                  initial={{ x: 0, opacity: 1 }}
                  animate={{ x: i18n.language === "de" ? -40 : 40, opacity: 1 }}
                  exit={{ x: i18n.language === "de" ? -40 : 40, opacity: 1 }}
                  transition={{ duration: 0.12, ease: "linear" }}
                />
                <motion.img
                  key={i18n.language + "-enter"}
                  src={i18n.language === "de" ? DeFlag : UsFlag}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ transform: "scale(1.5)", zIndex: 2 }}
                  initial={{ x: i18n.language === "de" ? 40 : -40, opacity: 1 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: i18n.language === "de" ? 40 : -40, opacity: 1 }}
                  transition={{ duration: 0.12, ease: "linear" }}
                />
              </AnimatePresence>
            </motion.button>
          </motion.nav>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;