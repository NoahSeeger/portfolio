import React from "react";
import { FaCircleCheck } from "react-icons/fa6";
import SectionTitle from "./SectionTitle";
import { useTranslation } from "react-i18next";

function Experience() {
  const { t } = useTranslation();
  return (
    <section id="EXPERIENCE" className="py-16">>
      <div className="container mx-auto px-4">
        <SectionTitle
          title={t("experience_title", "Erfahrung")}
          subtitle={t("experience_subtitle", "Fähigkeiten")}
        />
        <div className="grid md:grid-cols-2 gap-6 mt-10">
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
  // Teile die Skills in zwei Spalten auf
  const mid = Math.ceil(skills.length / 2);
  const col1 = skills.slice(0, mid);
  const col2 = skills.slice(mid);

  return (
    <div className="p-6 rounded-lg shadow-lg" style={{ backgroundColor: "var(--bg-primary)" }}>
      <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
        <ul className="flex flex-col gap-3">
          {col1.map((skill, index) => (
            <SkillItem key={index} name={skill.name} level={skill.level} />
          ))}
        </ul>
        <ul className="flex flex-col gap-3">
          {col2.map((skill, index) => (
            <SkillItem key={index} name={skill.name} level={skill.level} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function SkillItem({ name, level }) {
  return (
    <li className="flex items-center gap-3 min-h-[40px]">
      <FaCircleCheck className="text-green-500 flex-shrink-0" size={20} />
      <div className="flex flex-col">
        <span className="font-semibold leading-tight">{name}</span>
        <span className="text-sm leading-tight" style={{ color: "var(--text-secondary)" }}>{level}</span>
      </div>
    </li>
  );
}

export default Experience;
