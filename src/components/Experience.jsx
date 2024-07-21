import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import SectionTitle from "./SectionTitle";

function Experience() {
  return (
    <section id="EXPERIENCE" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle title={"Meine"} subtitle={"Fähigkeiten"} />
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <SkillCard title="Web-Entwicklung" skills={webDevelopmentSkills} />
          <SkillCard title="Weitere Kompetenzen" skills={additionalSkills} />
        </div>
      </div>
    </section>
  );
}

const webDevelopmentSkills = [
  { name: "HTML", level: "Fortgeschritten" },
  { name: "CSS", level: "Fortgeschritten" },
  { name: "JavaScript", level: "Mittel" },
  { name: "React", level: "Grundkenntnisse" },
  { name: "Responsive Design", level: "Grundkenntnisse" },
  { name: "Git", level: "Grundkenntnisse" },
];

const additionalSkills = [
  { name: "Problemlösung", level: "Fortgeschritten" },
  { name: "Selbstständiges Lernen", level: "Fortgeschritten" },
  { name: "Teamarbeit", level: "Mittel" },
  { name: "Englisch", level: "Fließend" },
  { name: "Projektmanagement", level: "Grundkenntnisse" },
  { name: "Agile Methoden", level: "Grundkenntnisse" },
];

function SkillCard({ title, skills }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill, index) => (
          <SkillItem key={index} name={skill.name} level={skill.level} />
        ))}
      </div>
    </div>
  );
}

function SkillItem({ name, level }) {
  return (
    <div className="flex items-center">
      <FaCheckCircle className="text-green-500 mr-2" />
      <div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-sm text-gray-600">{level}</p>
      </div>
    </div>
  );
}

export default Experience;
