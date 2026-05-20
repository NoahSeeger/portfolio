import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Logo from "../assets/personal/icon.png";

const SCROLL_COMPACT_THRESHOLD = 33;
const SCROLL_SMOOTH_TOLERANCE = 50;
const BOTTOM_TOLERANCE = 100;
const SCROLL_DEBOUNCE_MS = 16;
const SMOOTH_SCROLL_TIMEOUT = 1000;

const SECTIONS = ["ABOUT", "POSTS", "PROJECTS", "CONTACT"];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("ABOUT");
  const [isCompact, setIsCompact] = useState(true);
  const { t, i18n } = useTranslation();

  const sectionRefs = useRef({});
  const scrollTimeoutRef = useRef(null);
  const isScrollingRef = useRef(false);
  const targetSectionRef = useRef(null);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "de";
    if (savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  useEffect(() => {
    SECTIONS.forEach((id) => {
      sectionRefs.current[id] = document.getElementById(id);
    });
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const scrollY = window.scrollY;
      const newIsCompact = scrollY <= SCROLL_COMPACT_THRESHOLD;

      if (newIsCompact !== isCompact) {
        setIsCompact(newIsCompact);
      }

      if (isScrollingRef.current && targetSectionRef.current) {
        const targetEl = sectionRefs.current[targetSectionRef.current];
        if (targetEl) {
          const targetTop = targetEl.offsetTop;
          if (Math.abs(scrollY - targetTop) < SCROLL_SMOOTH_TOLERANCE) {
            setActiveSection(targetSectionRef.current);
            isScrollingRef.current = false;
            targetSectionRef.current = null;
          }
        }
        return;
      }

      const scrollPosition = scrollY + window.innerHeight / 2;
      let closestSection = "ABOUT";
      let minDistance = Infinity;

      for (const section of SECTIONS) {
        const el = sectionRefs.current[section];
        if (el) {
          const distance = Math.abs(scrollPosition - el.offsetTop);
          if (distance < minDistance) {
            minDistance = distance;
            closestSection = section;
          }
        }
      }

      if (scrollY + window.innerHeight >= document.documentElement.scrollHeight - BOTTOM_TOLERANCE) {
        closestSection = "CONTACT";
      }

      if (closestSection !== activeSection) {
        setActiveSection(closestSection);
      }
    }, SCROLL_DEBOUNCE_MS);
  }, [isCompact, activeSection]);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  const handleLangToggle = useCallback(() => {
    const newLang = i18n.language === "de" ? "en" : "de";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
  }, [i18n]);

  const handleNavClick = useCallback((e, sectionId) => {
    e.preventDefault();
    const section = sectionRefs.current[sectionId];
    if (section) {
      isScrollingRef.current = true;
      targetSectionRef.current = sectionId;
      setActiveSection(sectionId);
      section.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);

      setTimeout(() => {
        isScrollingRef.current = false;
        targetSectionRef.current = null;
      }, SMOOTH_SCROLL_TIMEOUT);
    }
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const navLinks = useMemo(
    () => [
      { id: "POSTS", label: t("nav_posts", "Beiträge") },
      { id: "ABOUT", label: t("nav_about", "Über mich") },
      { id: "PROJECTS", label: t("nav_projects", "Projekte") },
      { id: "CONTACT", label: t("nav_contact", "Kontakt") },
    ],
    [t]
  );

  return (
    <header className="sticky top-6 z-50 mx-4 md:mx-0 flex justify-center">
      <div
        className={`w-full max-w-4xl px-5 py-2 transition-all duration-300 ease-out rounded-2xl backdrop-blur-2xl border border-white/0 ${
          isCompact ? "bg-transparent" : "bg-white/20"
        }`}
        style={
          isCompact
            ? {
                borderColor: "transparent",
                background: "transparent",
                boxShadow: "none",
              }
            : {
                borderColor: "rgba(255,255,255,0.4)",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0.1) 100%)",
                boxShadow:
                  "0 8px 32px rgba(124, 58, 237, 0.08), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(255,255,255,0.1)",
              }
        }
      >
        <div className="flex h-14 items-center justify-between">
          <a
            href="/"
            className={`flex items-center gap-3 shrink-0 transition-transform duration-300 ease-out ${
              isCompact ? "-translate-x-20" : "translate-x-0"
            }`}
          >
            <img alt="Logo" className="h-10 w-auto object-contain" src={Logo} />
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className="relative px-4 py-1.5 text-sm font-medium rounded-full"
              >
                <span
                  className={`relative z-10 transition-colors duration-200 ${
                    activeSection === link.id
                      ? "text-white"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </span>
                {activeSection === link.id && (
                  <motion.div
                    layoutId="activeNavBubble"
                    className="absolute inset-0 z-0 bg-purple-accent rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLangToggle}
              className={`hidden md:inline-flex items-center px-4 h-9 text-sm font-semibold rounded-full text-white bg-purple-accent hover:bg-purple-accent/90 shadow-lg transition-transform duration-300 ${
                isCompact ? "translate-x-20" : "translate-x-0"
              }`}
            >
              {i18n.language === "de" ? "DE" : "EN"}
            </button>

            <button
              type="button"
              aria-label="Toggle menu"
              onClick={toggleMenu}
              className={`md:hidden flex items-center justify-center size-10 rounded-full transition-all duration-300 ${
                isMenuOpen
                  ? "bg-purple-accent text-white shadow-lg scale-110"
                  : isCompact
                  ? "bg-white/80 backdrop-blur-sm border-2 border-purple-accent/20 text-purple-accent shadow-md hover:scale-105"
                  : "bg-white/60 backdrop-blur-sm border border-purple-accent/30 text-purple-accent hover:bg-white/80 hover:scale-105"
              } ${isCompact ? "translate-x-5" : "translate-x-0"}`}
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {isMenuOpen ? <FaXmark className="size-5" /> : <FaBars className="size-5" />}
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.div
              className="absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-xl border-2 border-purple-accent/20 rounded-2xl shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="bg-purple-accent px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img alt="Logo" className="h-8 w-auto object-contain" src={Logo} />
                    <span className="text-white font-semibold text-lg">Menu</span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center size-8 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200"
                  >
                    <FaXmark className="size-4" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.button
                      key={link.id}
                      onClick={(e) => handleNavClick(e, link.id)}
                      className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-300 group ${
                        activeSection === link.id
                          ? "bg-purple-accent/10 text-purple-accent border-2 border-purple-accent/20"
                          : "text-gray-700 hover:bg-gray-50 hover:text-purple-accent border-2 border-transparent hover:border-purple-accent/10"
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-medium">{link.label}</span>
                        <div
                          className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                            activeSection === link.id
                              ? "bg-purple-accent"
                              : "bg-gray-300 group-hover:bg-purple-accent"
                          }`}
                        />
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleLangToggle}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-purple-accent text-white hover:bg-purple-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <span className="font-semibold">
                      {i18n.language === "de" ? "Switch to English" : "Wechsel zu Deutsch"}
                    </span>
                    <span className="text-sm opacity-90">{i18n.language === "de" ? "DE" : "EN"}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;