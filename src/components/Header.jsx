import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Logo from "../assets/personal/icon.png";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("ABOUT");
  const { t, i18n } = useTranslation();
  const [isCompact, setIsCompact] = useState(true);

  // Use refs to avoid stale closures and improve performance
  const scrollTimeoutRef = useRef(null);
  const isCompactRef = useRef(true);
  const activeSectionRef = useRef("ABOUT");
  const isScrollingRef = useRef(false);
  const targetSectionRef = useRef(null);

  // Language initialization - simplified
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "de";
    if (savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  // Optimized scroll handler using refs to prevent dependency issues
  const handleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const scrollY = window.scrollY;
      const newIsCompact = scrollY <= 33;

      // Only update if changed to prevent unnecessary re-renders
      if (newIsCompact !== isCompactRef.current) {
        isCompactRef.current = newIsCompact;
        setIsCompact(newIsCompact);
      }

      // Skip section detection if we're in the middle of a programmatic scroll
      if (isScrollingRef.current && targetSectionRef.current) {
        // Check if we're close to the target section
        const targetElement = document.getElementById(targetSectionRef.current);
        if (targetElement) {
          const targetTop = targetElement.offsetTop;
          const tolerance = 50; // pixels tolerance

          if (Math.abs(scrollY - targetTop) < tolerance) {
            // We've reached the target, update immediately and stop scrolling state
            activeSectionRef.current = targetSectionRef.current;
            setActiveSection(targetSectionRef.current);
            isScrollingRef.current = false;
            targetSectionRef.current = null;
          }
        }
        return; // Don't do normal section detection while scrolling
      }

      // Normal active section detection
      const sections = ["ABOUT", "EXPERIENCE", "PROJECTS", "CONTACT"];
      const scrollPosition = scrollY + window.innerHeight / 2;

      let closestSection = "ABOUT";
      let minDistance = Infinity;

      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) {
          const distance = Math.abs(scrollPosition - element.offsetTop);
          if (distance < minDistance) {
            minDistance = distance;
            closestSection = section;
          }
        }
      });

      // Check if at bottom of page
      if (
        scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 100
      ) {
        closestSection = "CONTACT";
      }

      // Only update if section changed
      if (closestSection !== activeSectionRef.current) {
        activeSectionRef.current = closestSection;
        setActiveSection(closestSection);
      }
    }, 16); // ~60fps
  }, []);

  // Single scroll effect with proper cleanup
  useEffect(() => {
    // Set initial state
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
    const section = document.getElementById(sectionId);
    if (section) {
      // Set scrolling state and target
      isScrollingRef.current = true;
      targetSectionRef.current = sectionId;

      // Immediately update active section for instant visual feedback
      setActiveSection(sectionId);
      activeSectionRef.current = sectionId;

      // Start smooth scroll
      section.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);

      // Fallback: clear scrolling state after animation should be done
      setTimeout(() => {
        isScrollingRef.current = false;
        targetSectionRef.current = null;
      }, 1000); // Smooth scroll usually takes ~500-800ms
    }
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  // Memoized navigation links
  const navLinks = [
    { id: "ABOUT", label: t("nav_about", "Über mich") },
    { id: "EXPERIENCE", label: t("nav_experience", "Erfahrung") },
    { id: "PROJECTS", label: t("nav_projects", "Projekte") },
    { id: "CONTACT", label: t("nav_contact", "Kontakt") },
  ];

  return (
    <header className="sticky top-6 z-50 mx-4 md:mx-0 flex justify-center">
      <div
        className={`w-full max-w-4xl px-4 transition-all duration-300 ease-out ${
          isCompact
            ? "border-0 bg-transparent"
            : "border-2 border-border/30 backdrop-blur-xl bg-background/75 rounded-full"
        }`}
        style={{
          backgroundColor: isCompact
            ? "transparent"
            : "rgba(224, 224, 224, 0.314)",
          borderColor: isCompact ? "transparent" : "rgba(66, 43, 103, 0.3)",
        }}
      >
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className={`flex items-center gap-3 shrink-0 transition-transform duration-300 ease-out ${
              isCompact ? "-translate-x-5" : "translate-x-0"
            }`}
          >
            <img alt="Logo" className="h-10 w-auto object-contain" src={Logo} />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`relative inline-block text-sm font-medium transition-all duration-300 ease-out ${
                  activeSection === link.id
                    ? "text-[#422B67] scale-105"
                    : "text-primary hover:text-[#422B67] scale-100"
                }`}
              >
                {/* Active background with smooth transition */}
                <div
                  className={`absolute -inset-x-3 -inset-y-1.5 backdrop-blur-sm border border-[#422B67]/30 rounded-full -z-10 transition-all duration-300 ease-out ${
                    activeSection === link.id
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95"
                  }`}
                  style={{ backgroundColor: "rgba(230, 230, 230, 0.188)" }}
                />
                <span className="relative">{link.label}</span>
              </a>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={handleLangToggle}
              className={`hidden md:inline-flex items-center px-4 h-9 text-sm font-semibold rounded-full text-white bg-gradient-to-t from-[#422B67] to-[#422B67] hover:to-[#422B67]/90 border border-[#422B67]/80 shadow-lg transition-transform duration-300 ease-out ${
                isCompact ? "translate-x-5" : "translate-x-0"
              }`}
            >
              {i18n.language === "de" ? "DE" : "EN"}
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={toggleMenu}
              className={`md:hidden flex items-center justify-center size-10 rounded-full transition-all duration-300 ease-out ${
                isMenuOpen
                  ? "bg-[#422B67] text-white shadow-lg scale-110"
                  : isCompact
                  ? "bg-white/80 backdrop-blur-sm border-2 border-[#422B67]/20 text-[#422B67] shadow-md hover:shadow-lg hover:scale-105"
                  : "bg-white/60 backdrop-blur-sm border border-[#422B67]/30 text-[#422B67] hover:bg-white/80 hover:scale-105"
              } ${isCompact ? "translate-x-5" : "translate-x-0"}`}
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {isMenuOpen ? (
                  <FaTimes className="size-5" />
                ) : (
                  <FaBars className="size-5" />
                )}
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Content */}
            <motion.div
              className="absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-xl border-2 border-[#422B67]/20 rounded-2xl shadow-2xl overflow-hidden"
              initial={{
                opacity: 0,
                scale: 0.95,
                y: -20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: -20,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.3,
              }}
            >
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-[#422B67] to-[#422B67]/80 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      alt="Logo"
                      className="h-8 w-auto object-contain"
                      src={Logo}
                    />
                    <span className="text-white font-semibold text-lg">
                      Menu
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center size-8 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200"
                  >
                    <FaTimes className="size-4" />
                  </button>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="p-6">
                <div className="space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.button
                      key={link.id}
                      onClick={(e) => handleNavClick(e, link.id)}
                      className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-300 group ${
                        activeSection === link.id
                          ? "bg-gradient-to-r from-[#422B67]/10 to-[#422B67]/5 text-[#422B67] border-2 border-[#422B67]/20"
                          : "text-gray-700 hover:bg-gray-50 hover:text-[#422B67] border-2 border-transparent hover:border-[#422B67]/10"
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-medium">
                          {link.label}
                        </span>
                        <motion.div
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            activeSection === link.id
                              ? "bg-[#422B67] scale-100"
                              : "bg-gray-300 scale-75 group-hover:bg-[#422B67] group-hover:scale-100"
                          }`}
                          animate={{
                            scale: activeSection === link.id ? 1 : 0.75,
                            backgroundColor:
                              activeSection === link.id ? "#422B67" : "#d1d5db",
                          }}
                        />
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Language Toggle */}
                <motion.div
                  className="mt-6 pt-6 border-t border-gray-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <button
                    onClick={handleLangToggle}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-[#422B67] to-[#422B67]/90 text-white hover:from-[#422B67]/90 hover:to-[#422B67]/80 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <span className="font-semibold">
                      {i18n.language === "de"
                        ? "Switch to English"
                        : "Wechsel zu Deutsch"}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm opacity-90">
                        {i18n.language === "de" ? "DE" : "EN"}
                      </span>
                      <motion.div
                        className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-xs font-bold">
                          {i18n.language === "de" ? "EN" : "DE"}
                        </span>
                      </motion.div>
                    </div>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
