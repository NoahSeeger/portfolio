import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <span className="text-xl font-bold">Noah Seeger</span>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

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
          <nav className="md:hidden py-4">
            <NavLink href="#ABOUT" text="Über mich" mobile />
            <NavLink href="#EXPERIENCE" text="Erfahrung" mobile />
            <NavLink href="#PROJECTS" text="Projekte" mobile />
            <NavLink href="#CONTACT" text="Kontakt" mobile />
          </nav>
        )}
      </div>
    </header>
  );
}

function NavLink({ href, text, mobile }) {
  const baseClasses = "transition duration-300 hover:text-blue-600";
  const mobileClasses = mobile ? "block py-2" : "";

  return (
    <a href={href} className={`${baseClasses} ${mobileClasses}`}>
      {text}
    </a>
  );
}

export default Header;
