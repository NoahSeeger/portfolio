import React from "react";
import FocusForge from "../assets/projects/FocusForge.png";
import Zinsrechner from "../assets/projects/Zinsrechner.png";
import LifeCircles from "../assets/projects/LifeCircles.png";
import CleanCord from "../assets/projects/CleanCord.png";
import FullPage from "../assets/projects/FullPage.png";
import Feedbacker from "../assets/projects/Feedbacker.png";
import PicSwipe from "../assets/projects/PicSwipe.png";

import SectionTitle from "./SectionTitle";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

const projects = [
  {
    title: "PicSwipe",
    image: PicSwipe,
    description:
      "Einfaches Tool, welches beim sortieren und ausmisten der Gallerie hilft.",
    technologies: ["React Native", "Expo"],
    github: "https://github.com/NoahSeeger/PicSwipe",
    liveDemo: "https://picswipe.netlify.app/",
  },
  {
    title: "FocusForge",
    image: FocusForge,
    description:
      "Eine Produktivitäts-Erweiterung, die Benutzern hilft, ihre Zeit und Aufgaben effektiv zu verwalten.",
    technologies: ["HTML", "CSS", "Javascript"],
    github: "https://github.com/NoahSeeger/FocusForge",
    liveDemo: "https://github.com/NoahSeeger/FocusForge",
  },
  {
    title: "Zinsrechner",
    image: Zinsrechner,
    description:
      "Zinsen und Zinseszinsen berechnen. Einfach und schnell mit dem Zinsrechner.",
    technologies: ["React", "TailwindCSS", "Javascript"],
    github: "https://github.com/NoahSeeger/zinsrechner",
    liveDemo: "https://zinsenrechner.netlify.app",
  },
  {
    title: "LifeCircles",
    image: LifeCircles,
    description:
      "Gewohnheiten visualisieren. Behalte den Überblick über dein Lebensverlauf.",
    technologies: ["React", "TailwindCSS", "Javascript", "Shadcn"],
    github: "https://github.com/NoahSeeger/LifeCircles",
    liveDemo: "https://LifeCircles.netlify.app",
  },
  {
    title: "CleanCord",
    image: CleanCord,
    description:
      "Dieses Tool wurde mit der OAuth2-API von Discord entwickelt und hilft Nutzern bei der Organisation und Verwaltung ihrer Discord-Server-Mitgliedschaften.",
    technologies: ["OAuth", "TailwindCSS", "Javascript"],
    github: "https://github.com/NoahSeeger/CleanCord",
    liveDemo: "https://Cleancord.netlify.app",
  },
  {
    title: "FullPage",
    image: FullPage,
    description:
      "Eine Chrome-Extension zum Erstellen von vollständigen Screenshots ganzer Webseiten.",
    technologies: ["HTML", "CSS", "Javascript"],
    github: "https://github.com/NoahSeeger/FullPage-Extension",
    liveDemo: "https://github.com/NoahSeeger/FullPage-Extension",
  },
  {
    title: "Feedbacker",
    image: Feedbacker,
    description:
      "Mit Feedbacker können Sie ganz einfach anonymes Feedback sammeln. Erstellen Sie ein Board, teilen Sie den Link und lassen Sie die Community die besten Ideen finden.",
    technologies: ["React", "TailwindCSS", "Supabase"],
    github: "https://github.com/NoahSeeger/feedbacker",
    liveDemo: "https://feedbackersite.netlify.app",
  },
];

function Projects() {
  return (
    <section id="PROJECTS" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle title={"Erkunde meine"} subtitle={"Projekte"} />
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
      <div className="relative pb-[56.25%]">
        {" "}
        {/* 16:9 Aspect Ratio */}
        <img
          src={project.image}
          alt={project.title}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl mb-2">{project.title}</h3>
        <p className="text-gray-700 text-base mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex justify-between">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800 transition duration-300"
          >
            <FaGithub className="mr-2" /> GitHub
          </a>
          <a
            href={project.liveDemo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-green-600 hover:text-green-800 transition duration-300"
          >
            <FaExternalLinkAlt className="mr-2" /> Live Demo
          </a>
        </div>
      </div>
    </div>
  );
}

export default Projects;
