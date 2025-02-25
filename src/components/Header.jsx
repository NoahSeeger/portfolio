import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
            Noah Seeger
          </motion.span>

          {/* Mobile menu button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </motion.button>

          {/* Desktop menu */}
          <nav className="hidden md:flex gap-6">
            <NavLink href="#ABOUT" text="Über mich" />
            <NavLink href="#EXPERIENCE" text="Erfahrung" />
            <NavLink href="#PROJECTS" text="Projekte" />
            <NavLink href="#CONTACT" text="Kontakt" />
          </nav>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden py-4 space-y-2"
          >
            <NavLink href="#ABOUT" text="Über mich" mobile />
            <NavLink href="#EXPERIENCE" text="Erfahrung" mobile />
            <NavLink href="#PROJECTS" text="Projekte" mobile />
            <NavLink href="#CONTACT" text="Kontakt" mobile />
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
