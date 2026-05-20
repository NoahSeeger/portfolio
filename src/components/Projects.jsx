import React from "react";
import { FaGithub, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import SectionTitle from "./SectionTitle";
import { getFeaturedProjects } from "../lib/blog";

function ProjectItem({ project, index }) {
  const { t } = useTranslation();

  return (
    <article className="group grid md:grid-cols-[1fr_1.5fr] gap-6 md:gap-10 py-10 border-b border-gray-200 last:border-b-0">
      {/* Image */}
      <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[4/3]">
        {project.heroImage ? (
          <img
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No preview
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center">
        <div className="flex items-start justify-between gap-4 mb-2">
          <Link to={`/blog/${project.slug}`} className="group/title">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 group-hover/title:text-gray-600 transition-colors">
              {project.title}
            </h3>
          </Link>
          <Link
            to={`/blog/${project.slug}`}
            className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors mt-1"
          >
            →
          </Link>
        </div>

        <p className="text-gray-500 text-sm md:text-base mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies?.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-mono"
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
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
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
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
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
    <section id="PROJECTS" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <SectionTitle
          title={t("explore_my")}
          subtitle={t("projects")}
        />

        <div className="mt-12 max-w-4xl mx-auto">
          {projects.map((project, index) => (
            <ProjectItem key={project.slug} project={project} index={index} />
          ))}

          <div className="pt-8 text-center">
            <Link
              to="/blog?category=project"
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
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