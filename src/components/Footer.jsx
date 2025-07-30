import React from "react";
import { useTranslation } from "react-i18next";
import { DatenschutzLink } from "./DSGVO";

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="py-6 bg-gray-50 text-black">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-wrap justify-center md:justify-start text-lg gap-6 mb-4 md:mb-0">
          <FooterLink href="#ABOUT" text={t("footer_about", "Über mich")} />
          <FooterLink
            href="#EXPERIENCE"
            text={t("footer_experience", "Erfahrung")}
          />
          <FooterLink
            href="#PROJECTS"
            text={t("footer_projects", "Projekte")}
          />
          <FooterLink href="#CONTACT" text={t("footer_contact", "Kontakt")} />
          <DatenschutzLink />
        </div>
        <div className="text-center md:text-right text-gray-400">
          {t("footer_copyright", "© 2024 Noah Seeger. All Rights Reserved")}
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
