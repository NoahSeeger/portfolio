import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import FocusForge from "../assets/projects/FocusForge.png";
import Zinsrechner from "../assets/projects/Zinsrechner.png";
import LifeCircles from "../assets/projects/LifeCircles.png";
import CleanCord from "../assets/projects/CleanCord.png";
import FullPage from "../assets/projects/FullPage.png";
import Feedbacker from "../assets/projects/Feedbacker.png";
import PicSwipe from "../assets/projects/PicSwipe.png";
import Bruno from "../assets/projects/Bruno.png";
import Livo from "../assets/projects/Livo.png";

import SectionTitle from "./SectionTitle";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

const projects = [
  {
    title: { de: "Livo", en: "Livo" },
    image: Livo,
    description: {
      de: "Livo ist eine Progressive Web App, die es ermöglicht, seine Ziele und Länder zu verfolgen, die man bereist hat oder gerne besuchen will.",
      en: "Livo is a progressive web app that lets you track your goals and countries you have visited or want to visit.",
    },
    technologies: {
      de: ["Nextjs", "react-simple-maps", "Supabase"],
      en: ["Nextjs", "react-simple-maps", "Supabase"],
    },
    github: "https://github.com/NoahSeeger/livo",
    liveDemo: "https://livoapp.netlify.app",
  },
  {
    title: { de: "Bruno", en: "Bruno" },
    image: Bruno,
    description: {
      de: "Body Transformation Tracker mit Vergleichs und Progress Funktion.",
      en: "Body transformation tracker with comparison and progress features.",
    },
    technologies: {
      de: ["SwiftUI"],
      en: ["SwiftUI"],
    },
    github: "https://github.com/NoahSeeger/Pincode",
    liveDemo: "https://github.com/NoahSeeger/Pincode",
  },
  {
    title: { de: "PicSwipe", en: "PicSwipe" },
    image: PicSwipe,
    description: {
      de: "Einfaches Tool, welches beim sortieren und ausmisten der Gallerie hilft.",
      en: "A simple tool that helps you sort and clean up your gallery.",
    },
    technologies: {
      de: ["React Native", "Expo"],
      en: ["React Native", "Expo"],
    },
    github: "https://github.com/NoahSeeger/PicSwipe",
    liveDemo: "https://picswipe.netlify.app/",
  },
  {
    title: { de: "CleanCord", en: "CleanCord" },
    image: CleanCord,
    description: {
      de: "Dieses Tool wurde mit der OAuth2-API von Discord entwickelt und hilft Nutzern bei der Organisation und Verwaltung ihrer Discord-Server-Mitgliedschaften.",
      en: "This tool was developed with Discord's OAuth2 API and helps users organize and manage their Discord server memberships.",
    },
    technologies: {
      de: ["OAuth", "TailwindCSS", "Javascript"],
      en: ["OAuth", "TailwindCSS", "Javascript"],
    },
    github: "https://github.com/NoahSeeger/CleanCord",
    liveDemo: "https://Cleancord.netlify.app",
  },
  {
    title: { de: "Feedbacker", en: "Feedbacker" },
    image: Feedbacker,
    description: {
      de: "Mit Feedbacker können Sie ganz einfach anonymes Feedback sammeln. Erstellen Sie ein Board, teilen Sie den Link und lassen Sie die Community die besten Ideen finden.",
      en: "With Feedbacker you can easily collect anonymous feedback. Create a board, share the link and let the community find the best ideas.",
    },
    technologies: {
      de: ["React", "TailwindCSS", "Supabase"],
      en: ["React", "TailwindCSS", "Supabase"],
    },
    github: "https://github.com/NoahSeeger/feedbacker",
    liveDemo: "https://feedbackersite.netlify.app",
  },
  {
    title: { de: "LifeCircles", en: "LifeCircles" },
    image: LifeCircles,
    description: {
      de: "Gewohnheiten visualisieren. Behalte den Überblick über dein Lebensverlauf.",
      en: "Visualize habits. Keep track of your life journey.",
    },
    technologies: {
      de: ["React", "TailwindCSS", "Javascript", "Shadcn"],
      en: ["React", "TailwindCSS", "Javascript", "Shadcn"],
    },
    github: "https://github.com/NoahSeeger/LifeCircles",
    liveDemo: "https://LifeCircles.netlify.app",
  },
  {
    title: { de: "Zinsrechner", en: "Zinsrechner" },
    image: Zinsrechner,
    description: {
      de: "Zinsen und Zinseszinsen berechnen. Einfach und schnell mit dem Zinsrechner.",
      en: "Calculate interest and compound interest. Simple and fast with the interest calculator.",
    },
    technologies: {
      de: ["React", "TailwindCSS", "Javascript"],
      en: ["React", "TailwindCSS", "Javascript"],
    },
    github: "https://github.com/NoahSeeger/zinsrechner",
    liveDemo: "https://zinsenrechner.netlify.app",
  },
  {
    title: { de: "FullPage", en: "FullPage" },
    image: FullPage,
    description: {
      de: "Eine Chrome-Extension zum Erstellen von vollständigen Screenshots ganzer Webseiten.",
      en: "A Chrome extension for creating full-page screenshots of entire websites.",
    },
    technologies: {
      de: ["HTML", "CSS", "Javascript"],
      en: ["HTML", "CSS", "Javascript"],
    },
    github: "https://github.com/NoahSeeger/FullPage-Extension",
    liveDemo: "https://github.com/NoahSeeger/FullPage-Extension",
  },
];

const mainProjects = [
  projects.find((p) => p.title.de === "Livo"),
  projects.find((p) => p.title.de === "Bruno"),
  projects.find((p) => p.title.de === "PicSwipe"),
  projects.find((p) => p.title.de === "CleanCord"),
].filter(Boolean);

const otherProjects = projects.filter((p) => !mainProjects.includes(p));

function Projects() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "en" ? "en" : "de";
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % mainProjects.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + mainProjects.length) % mainProjects.length);
  };

  const isActive = (index) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 6000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  return (
    <section id="PROJECTS" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionTitle title={t("explore_my")} subtitle={t("projects")} />

        <div className="mt-12">
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {/* Project Images - 2/3 width on desktop */}
            <div className="md:col-span-2">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg shadow-lg">
                <AnimatePresence>
                  {mainProjects.map((project, index) => (
                    <motion.div
                      key={project.title[lang]}
                      initial={{
                        opacity: 0,
                        scale: 0.9,
                        z: -100,
                        rotate: randomRotateY(),
                      }}
                      animate={{
                        opacity: isActive(index) ? 1 : 0.7,
                        scale: isActive(index) ? 1 : 0.95,
                        z: isActive(index) ? 0 : -100,
                        rotate: isActive(index) ? 0 : randomRotateY(),
                        zIndex: isActive(index)
                          ? 999
                          : mainProjects.length + 2 - index,
                        y: isActive(index) ? [0, -40, 0] : 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.9,
                        z: 100,
                        rotate: randomRotateY(),
                      }}
                      transition={{
                        duration: 0.4,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 origin-bottom shadow-xl"
                    >
                      <img
                        src={project.image}
                        alt={project.title[lang]}
                        className="h-full w-full rounded-lg object-fit object-center bg-white"
                        draggable={false}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Project Info - 1/3 width on desktop */}
            <div className="md:col-span-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{
                    y: 20,
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  exit={{
                    y: -20,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                  className="bg-white p-6 rounded-lg shadow-lg"
                >
                  <h3 className="text-2xl font-bold mb-2">
                    {mainProjects[active].title[lang]}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {mainProjects[active].technologies[lang].map(
                      (tech, index) => (
                        <span
                          key={index}
                          className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
                        >
                          {tech}
                        </span>
                      )
                    )}
                  </div>

                  <motion.p
                    className="text-gray-700 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {mainProjects[active].description[lang]
                      .split(" ")
                      .map((word, index) => (
                        <motion.span
                          key={index}
                          initial={{
                            filter: "blur(5px)",
                            opacity: 0,
                            y: 3,
                          }}
                          animate={{
                            filter: "blur(0px)",
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            duration: 0.2,
                            ease: "easeInOut",
                            delay: 0.02 * index,
                          }}
                          className="inline-block"
                        >
                          {word}&nbsp;
                        </motion.span>
                      ))}
                  </motion.p>

                  <div className="flex justify-between mt-4">
                    <a
                      href={mainProjects[active].github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 transition duration-300"
                    >
                      <FaGithub className="mr-2" /> {t("github")}
                    </a>
                    <a
                      href={mainProjects[active].liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-green-600 hover:text-green-800 transition duration-300"
                    >
                      <FaExternalLinkAlt className="mr-2" /> {t("live_demo")}
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-center mt-6 gap-2">
                {mainProjects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActive(index);
                      setAutoplay(false);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === active ? "w-6 bg-blue-600" : "w-2 bg-gray-300"
                    }`}
                    aria-label={`Go to project ${index + 1}`}
                  />
                ))}
              </div>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={handlePrev}
                  onMouseEnter={() => setAutoplay(false)}
                  onMouseLeave={() => setAutoplay(true)}
                  className="h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center group transition-all duration-300 hover:bg-blue-50"
                >
                  <FaArrowLeft className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={handleNext}
                  onMouseEnter={() => setAutoplay(false)}
                  onMouseLeave={() => setAutoplay(true)}
                  className="h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center group transition-all duration-300 hover:bg-blue-50"
                >
                  <FaArrowRight className="h-4 w-4 text-blue-600 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Weitere Projekte Grid */}
        {otherProjects.length > 0 && (
          <div className="mt-16">
            <h4 className="text-xl font-semibold mb-6 text-center">
              {t("more_projects")}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {otherProjects.map((project) => (
                <div
                  key={project.title[lang]}
                  className="bg-white rounded-lg shadow p-4 flex flex-col h-full"
                >
                  <div className="flex items-center gap-3 mb-2">
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title[lang]}
                        className="w-10 h-10 object-contain rounded"
                      />
                    )}
                    <span className="font-bold text-lg">
                      {project.title[lang]}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.technologies[lang].map((tech, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 rounded px-2 py-0.5 text-xs text-gray-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {project.description[lang]}
                  </p>
                  <div className="mt-auto flex gap-3">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                    >
                      <FaGithub /> {t("github")}
                    </a>
                    {project.liveDemo && (
                      <a
                        href={project.liveDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline text-sm flex items-center gap-1"
                      >
                        <FaExternalLinkAlt /> {t("live_demo")}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Hinweis auf noch mehr Projekte auf GitHub */}
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700">
            {t("not_all")}{" "}
            <a
              href="https://github.com/NoahSeeger"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-semibold"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

export default Projects;
