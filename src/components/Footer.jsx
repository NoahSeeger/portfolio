import React from "react";

function Footer() {
  return (
    <footer className="py-6 bg-gray-50 text-black">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-wrap justify-center md:justify-start text-lg gap-6 mb-4 md:mb-0">
          <FooterLink href="#ABOUT" text="Über mich" />
          <FooterLink href="#EXPERIENCE" text="Erfahrung" />
          <FooterLink href="#PROJECTS" text="Projekte" />
          <FooterLink href="#CONTACT" text="Kontakt" />
        </div>
        <div className="text-center md:text-right text-gray-400">
          &copy; 2024 Noah Seeger. All Rights Reserved
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, text }) {
  return (
    <a href={href} className="hover:text-gray-400 transition duration-300">
      {text}
    </a>
  );
}

export default Footer;
