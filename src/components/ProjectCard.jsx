import React from "react";
import { FaGithub, FaArrowRight, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function ProjectCard({ project }) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
      {/* Hero Image */}
      {project.heroImage && (
        <div className="aspect-video bg-gray-100 overflow-hidden">
          <img
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-xl font-semibold text-gray-900">
            {project.title}
          </h3>
          <Link
            to={`/blog/${project.slug}`}
            className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaArrowRight size={18} />
          </Link>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Technologies */}
        {project.technologies && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-mono"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
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
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
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