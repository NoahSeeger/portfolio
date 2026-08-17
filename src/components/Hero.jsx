import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaArrowRight, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { getAllPosts } from "../lib/blog";
import profileImage from "../assets/personal/me.png";

function SectionHeading({ title, link, linkLabel }) {
  return (
    <div className="portfolio-section-heading">
      <div>
        <h2>{title}</h2>
      </div>
      {link && (
        <Link to={link} className="portfolio-section-link">
          {linkLabel}
          <FaArrowRight aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

function ProjectCard({ project }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="portfolio-project-card"
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {project.heroImage && (
        <img
          src={project.heroImage}
          alt=""
          className="portfolio-project-image"
          loading="lazy"
          draggable="false"
        />
      )}
      <div className="portfolio-project-body">
        <div className="portfolio-project-title-row">
          <h3>{project.title}</h3>
          <FaArrowUpRightFromSquare aria-hidden="true" />
        </div>
        <p>{project.description}</p>
        {project.tags?.length > 0 && (
          <div className="portfolio-tags">
            {project.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        )}
        <Link to={`/blog/${project.slug}`} className="portfolio-card-link">
          Mehr zum Projekt <FaArrowRight aria-hidden="true" />
        </Link>
      </div>
    </motion.div>
  );
}

function Hero() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const projects = getAllPosts()
    .filter((post) => post.category === "project" && post.status !== "archived" && !post.draft)
    .slice(0, 3);

  return (
    <div className="portfolio-home">
      <motion.section
        className="portfolio-hero"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="portfolio-portrait" aria-hidden="true">
          <img src={profileImage} alt={t("hero_img_alt", "Noah Seeger")} />
        </div>

        <h1>Noah Seeger</h1>
        <p className="portfolio-meta">{t("about_line1", "Student @ HdM Stuttgart, Mobile Media.")}</p>

        <div className="portfolio-intro">
          <p>{t("home_intro", "Ich studiere Mobile Media an der HdM Stuttgart. In meiner Freizeit baue ich iOS-Apps, probiere Homelab-Setups aus und lerne, wie aus kleinen Ideen funktionierende Projekte werden. Was dabei funktioniert und was nicht, schreibe ich hier auf.")}</p>
        </div>
      </motion.section>

      <div className="portfolio-content">
        <section id="work" className="portfolio-section">
          <SectionHeading
            title={t("home_work_heading", "Projekte")}
            link="/blog?category=project"
            linkLabel={t("projects_all", "Alle Projekte")}
          />
          <div className="portfolio-project-list">
            {projects.length > 0 ? projects.map((project) => <ProjectCard key={project.slug} project={project} />) : (
              <p className="portfolio-empty">{t("projects_no_current", "Neue Projekte folgen.")}</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Hero;
