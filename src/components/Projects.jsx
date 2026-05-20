import React from "react";
import { FaGithub, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import SectionTitle from "./SectionTitle";
import { getFeaturedProjects } from "../lib/blog";

function ProjectItem({ project, index }) {
  const { t } = useTranslation();

  return (
    <article className="group grid md:grid-cols-[1fr_1.5fr] gap-6 md:gap-10 py-10 last:border-b-0" style={{ borderBottom: "1px solid var(--border)" }}>
      {/* Image */}
      <div className="relative overflow-hidden rounded-lg aspect-[4/3]" style={{ backgroundColor: "var(--bg-tertiary)" }}>
        {project.heroImage ? (
          <img
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm" style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-muted)" }}>
            No preview
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center">
        <div className="flex items-start justify-between gap-4 mb-2">
          <Link to={`/blog/${project.slug}`} className="group/title">
            <h3 className="text-2xl md:text-3xl font-bold group-hover/title:opacity-80 transition-opacity" style={{ color: "var(--text-primary)" }}>
              {project.title}
            </h3>
          </Link>
          <Link
            to={`/blog/${project.slug}`}
            className="shrink-0 transition-opacity mt-1"
            style={{ color: "var(--text-muted)" }}
          >
            →
          </Link>
        </div>

        <p className="text-sm md:text-base mb-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies?.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded text-xs font-mono"
              style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm transition-opacity"
              style={{ color: "var(--text-secondary)" }}
            >
              <FaGithub size={16} />
              <span>GitHub</span>
            </a>
          )}
          {project.liveDemo && (
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm transition-opacity"
              style={{ color: "var(--text-secondary)" }}
            >
              <FaArrowUpRightFromSquare size={14} />
              <span>Demo</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function Projects() {
  const { t } = useTranslation();
  const projects = getFeaturedProjects();

  return (
    <section id="PROJECTS" className="w-full">
      <div className="w-full">
        <SectionTitle
          title={t("explore_my")}
          subtitle={t("projects")}
        />

        <div className="mt-10">
          {projects.map((project, index) => (
            <ProjectItem key={project.slug} project={project} index={index} />
          ))}

          <div className="pt-8 text-center">
            <Link
              to="/blog?category=project"
              className="text-sm transition-opacity hover:opacity-80"
              style={{ color: "var(--text-muted)" }}
            >
              Alle Projekte →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Projects;