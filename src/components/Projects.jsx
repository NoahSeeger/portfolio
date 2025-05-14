import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FocusForge from "../assets/projects/FocusForge.png";
import Zinsrechner from "../assets/projects/Zinsrechner.png";
import LifeCircles from "../assets/projects/LifeCircles.png";
import CleanCord from "../assets/projects/CleanCord.png";
import FullPage from "../assets/projects/FullPage.png";
import Feedbacker from "../assets/projects/Feedbacker.png";
import PicSwipe from "../assets/projects/PicSwipe.png";

import SectionTitle from "./SectionTitle";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

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
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + projects.length) % projects.length);
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
        <SectionTitle title={"Erkunde meine"} subtitle={"Projekte"} />

        <div className="mt-12">
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {/* Project Images - 2/3 width on desktop */}
            <div className="md:col-span-2">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg shadow-lg">
                <AnimatePresence>
                  {projects.map((project, index) => (
                    <motion.div
                      key={project.title}
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
                          : projects.length + 2 - index,
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
                        alt={project.title}
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
                    {projects[active].title}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {projects[active].technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <motion.p
                    className="text-gray-700 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {projects[active].description
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
                      href={projects[active].github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 transition duration-300"
                    >
                      <FaGithub className="mr-2" /> GitHub
                    </a>
                    <a
                      href={projects[active].liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-green-600 hover:text-green-800 transition duration-300"
                    >
                      <FaExternalLinkAlt className="mr-2" /> Live Demo
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-center mt-6 gap-2">
                {projects.map((_, index) => (
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
      </div>
    </section>
  );
}

export default Projects;
