import React from "react";
import { FaGithub, FaArrowRight, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function ProjectCard({ project }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border)" }}>
      {/* Hero Image */}
      {project.heroImage && (
        <div className="aspect-video overflow-hidden select-none" style={{ backgroundColor: "var(--bg-tertiary)" }}>
          <img
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
            draggable="false"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
            {project.title}
          </h3>
          <Link
            to={`/blog/${project.slug}`}
            className="shrink-0 transition-opacity" style={{ color: "var(--text-muted)" }}
          >
            <FaArrowRight size={18} />
          </Link>
        </div>

        <p className="text-sm mb-4 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
          {project.description}
        </p>

        {/* Technologies */}
        {project.technologies && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded text-xs font-mono"
                style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-4 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm transition-colors"
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
              className="flex items-center gap-1.5 text-sm transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              <FaArrowUpRightFromSquare size={14} />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;