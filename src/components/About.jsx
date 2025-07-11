import React from "react";
import about from "../assets/personal/about.png";
import { PiStudent, PiGraduationCap } from "react-icons/pi";
import SectionTitle from "./SectionTitle";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function About() {
  const { t } = useTranslation();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!isHovered) return;
    const { clientX, clientY } = e;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 20 - 10;
    const y = ((clientY - rect.top) / rect.height) * 20 - 10;
    setTilt({ x, y });
  };

  return (
    <section id="ABOUT" className="min-h-screen py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle
          title={t("about_section_title", "Erfahre mehr")}
          subtitle={t("about_section_subtitle", "Über mich")}
        />
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mt-12">
          <div className="lg:w-1/2">
            <motion.img
              src={about}
              alt={t("about_img_alt", "Über mich")}
              className="rounded-3xl shadow-lg w-full max-w-md mx-auto"
              style={{
                transform: `perspective(500px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
              }}
              transition={{ type: "spring", stiffness: 300 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false);
                setTilt({ x: 0, y: 0 });
              }}
              onMouseMove={handleMouseMove}
            />
          </div>
          <div className="lg:w-1/2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard
                icon={<PiStudent className="text-4xl text-blue-600" />}
                title={t("about_card_programming_title", "Programmierung")}
                details={[
                  t("about_card_programming_years", "2+ Jahre"),
                  t("about_card_programming_type", "Selbststudium"),
                ]}
              />
              <InfoCard
                icon={<PiGraduationCap className="text-4xl text-green-600" />}
                title={t("about_card_education_title", "Ausbildung")}
                details={[
                  t("about_card_education_degree", "Abitur"),
                  t("about_card_education_status", "Angehender dualer Student"),
                ]}
              />
            </div>
            <p className="text-gray-700 leading-relaxed">
              {t(
                "about_text",
                "Als angehender Informatikstudent bringe ich bereits über zwei Jahre Erfahrung im Selbststudium der Programmierung mit. Meine Leidenschaft für die Webentwicklung habe ich durch zahlreiche persönliche Projekte und Online-Kurse vertieft. Besonders im Bereich Frontend-Entwicklung konnte ich fundierte Kenntnisse in HTML, CSS und JavaScript aufbauen. Ich bin hochmotiviert, meine bisherigen Erfahrungen in einem dualen Studium einzubringen und meine Fähigkeiten weiter auszubauen. Mein Ziel ist es, innovative und benutzerfreundliche Webanwendungen zu entwickeln und dabei stets die neuesten Technologien und Best Practices zu berücksichtigen."
              )}
            </p>
            <a
              href="#CONTACT"
              className="flex items-center justify-center bg-blue-600 text-white px-6 py-4 rounded-full hover:bg-blue-700 transition duration-300 whitespace-nowrap w-fit"
            >
              {t("about_contact_button", "Kontakt aufnehmen")}
              <MdOutlineArrowForwardIos size={22} className="ml-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ icon, title, details }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
      <div className="flex items-center mb-4">
        {icon}
        <h2 className="text-xl font-semibold ml-3">{title}</h2>
      </div>
      {details.map((detail, index) => (
        <p key={index} className="text-gray-600">
          {detail}
        </p>
      ))}
    </div>
  );
}

export default About;
