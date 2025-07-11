import React, { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  // Sprache aus localStorage beim Mount setzen
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, []);

  // Sprache in localStorage speichern, wenn sie sich ändert
  useEffect(() => {
    localStorage.setItem("lang", i18n.language);
  }, [i18n.language]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Simpler Toggle-Button
  const handleLangToggle = () => {
    const newLang = i18n.language === "de" ? "en" : "de";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-md"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="text-xl font-bold text-gray-800"
          >
            {t("header_name", "Noah Seeger")}
          </motion.span>

          {/* Desktop menu */}
          <nav className="hidden md:flex gap-6">
            <NavLink href="#ABOUT" text={t("nav_about", "Über mich")} />
            <NavLink
              href="#EXPERIENCE"
              text={t("nav_experience", "Erfahrung")}
            />
            <NavLink href="#PROJECTS" text={t("nav_projects", "Projekte")} />
            <NavLink href="#CONTACT" text={t("nav_contact", "Kontakt")} />
          </nav>

          {/* Simpler Language Toggle ganz rechts */}
          <button
            onClick={handleLangToggle}
            className="ml-4 px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-blue-100 transition"
            aria-label={t("lang_toggle", "Sprache wechseln")}
          >
            {i18n.language === "de" ? "DE" : "EN"}
          </button>

          {/* Mobile menu button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2"
            onClick={toggleMenu}
            aria-label={
              isMenuOpen
                ? t("nav_close", "Menü schließen")
                : t("nav_open", "Menü öffnen")
            }
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </motion.button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden py-4 space-y-2"
          >
            <NavLink href="#ABOUT" text={t("nav_about", "Über mich")} mobile />
            <NavLink
              href="#EXPERIENCE"
              text={t("nav_experience", "Erfahrung")}
              mobile
            />
            <NavLink
              href="#PROJECTS"
              text={t("nav_projects", "Projekte")}
              mobile
            />
            <NavLink
              href="#CONTACT"
              text={t("nav_contact", "Kontakt")}
              mobile
            />
            {/* Language Toggle auch im Mobile Menu */}
            <button
              onClick={handleLangToggle}
              className="mt-4 px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 w-full hover:bg-blue-100 transition"
              aria-label={t("lang_toggle", "Sprache wechseln")}
            >
              {i18n.language === "de" ? "DE" : "EN"}
            </button>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
}

function NavLink({ href, text, mobile }) {
  return (
    <motion.a
      whileHover={{
        scale: 1.05,
        color: "#3b82f6",
      }}
      whileTap={{ scale: 0.95 }}
      href={href}
      className={`${
        mobile ? "block py-2 px-4 hover:bg-gray-100 rounded-lg" : ""
      } transition duration-300 text-gray-700 hover:text-blue-600 font-medium`}
    >
      {text}
    </motion.a>
  );
}

export default Header;
