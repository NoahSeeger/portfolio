import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import SectionTitle from "./SectionTitle";
import { useTranslation } from "react-i18next";

function Experience() {
  const { t } = useTranslation();
  return (
    <section id="EXPERIENCE" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle
          title={t("experience_title", "Erfahrung")}
          subtitle={t("experience_subtitle", "Fähigkeiten")}
        />
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <SkillCard
            title={t("experience_skill_web_development", "Web-Entwicklung")}
            skills={webDevelopmentSkills(t)}
          />
          <SkillCard
            title={t("experience_skill_additional", "Weitere Kompetenzen")}
            skills={additionalSkills(t)}
          />
        </div>
      </div>
    </section>
  );
}

const webDevelopmentSkills = (t) => [
  {
    name: t("skill_html", "HTML"),
    level: t("level_advanced", "Fortgeschritten"),
  },
  {
    name: t("skill_css", "CSS"),
    level: t("level_advanced", "Fortgeschritten"),
  },
  {
    name: t("skill_js", "JavaScript"),
    level: t("level_intermediate", "Mittel"),
  },
  {
    name: t("skill_react", "React"),
    level: t("level_basic", "Grundkenntnisse"),
  },
  {
    name: t("skill_responsive", "Responsive Design"),
    level: t("level_basic", "Grundkenntnisse"),
  },
  { name: t("skill_git", "Git"), level: t("level_basic", "Grundkenntnisse") },
];

const additionalSkills = (t) => [
  {
    name: t("skill_problem_solving", "Problemlösung"),
    level: t("level_advanced", "Fortgeschritten"),
  },
  {
    name: t("skill_self_learning", "Selbstständiges Lernen"),
    level: t("level_advanced", "Fortgeschritten"),
  },
  {
    name: t("skill_teamwork", "Teamarbeit"),
    level: t("level_intermediate", "Mittel"),
  },
  {
    name: t("skill_english", "Englisch"),
    level: t("level_fluent", "Fließend"),
  },
  {
    name: t("skill_project_management", "Projektmanagement"),
    level: t("level_basic", "Grundkenntnisse"),
  },
  {
    name: t("skill_agile", "Agile Methoden"),
    level: t("level_basic", "Grundkenntnisse"),
  },
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
