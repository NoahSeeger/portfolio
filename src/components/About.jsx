import React from "react";
import about from "../assets/personal/about.png";
import { PiStudent, PiGraduationCap } from "react-icons/pi";
import SectionTitle from "./SectionTitle";
import { MdOutlineArrowForwardIos } from "react-icons/md";

function About() {
  return (
    <section id="ABOUT" className="min-h-screen py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle title={"Erfahre mehr"} subtitle={"Über mich"} />
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mt-12">
          <div className="lg:w-1/2">
            <img
              src={about}
              alt="Über mich"
              className="rounded-3xl shadow-lg w-full max-w-md mx-auto"
            />
          </div>
          <div className="lg:w-1/2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard
                icon={<PiStudent className="text-4xl text-blue-600" />}
                title="Programmiererfahrung"
                details={["2+ Jahre", "Selbststudium"]}
              />
              <InfoCard
                icon={<PiGraduationCap className="text-4xl text-green-600" />}
                title="Ausbildung"
                details={["Abitur", "Angehender dualer Student"]}
              />
            </div>
            <p className="text-gray-700 leading-relaxed">
              Als angehender Informatikstudent bringe ich bereits über zwei
              Jahre Erfahrung im Selbststudium der Programmierung mit. Meine
              Leidenschaft für die Webentwicklung habe ich durch zahlreiche
              persönliche Projekte und Online-Kurse vertieft. Besonders im
              Bereich Frontend-Entwicklung konnte ich fundierte Kenntnisse in
              HTML, CSS und JavaScript aufbauen. Ich bin hochmotiviert, meine
              bisherigen Erfahrungen in einem dualen Studium einzubringen und
              meine Fähigkeiten weiter auszubauen. Mein Ziel ist es, innovative
              und benutzerfreundliche Webanwendungen zu entwickeln und dabei
              stets die neuesten Technologien und Best Practices zu
              berücksichtigen.
            </p>
            <a
              href="#CONTACT"
              className="flex items-center justify-center w-56 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300"
            >
              Kontakt aufnehmen
              <MdOutlineArrowForwardIos size={22} />
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
