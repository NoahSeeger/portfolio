import React from "react";
import about from "../assets/personal/about.jpg";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import SectionTitle from "./SectionTitle";

function About() {
  const { t } = useTranslation();

  return (
    <section id="ABOUT" className="w-full">
      <div className="w-full">
        <SectionTitle
          title={t("about_section_title", "Erfahre mehr")}
          subtitle={t("about_section_subtitle", "Über mich")}
        />

        <div className="mt-10">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-52 flex-shrink-0"
            >
              <img
                src={about}
                alt={t("about_img_alt", "Über mich")}
                className="w-full aspect-square rounded-2xl object-cover shadow-lg select-none"
                draggable="false"
                loading="eager"
              />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex-1 space-y-4"
            >
              <p className="text-lg leading-relaxed" style={{ color: "var(--text-primary)" }}>
                {t("about_line1", "Currently: Student @ HMD Stuttgart, Mobile Media.")}
              </p>
              <p className="text-lg leading-relaxed" style={{ color: "var(--text-primary)" }}>
                {t("about_line2", "Exploring everything in tech and engineering.")}
              </p>
              <p className="text-lg leading-relaxed" style={{ color: "var(--text-primary)" }}>
                {t("about_line3", "Building iOS apps in my free time. PicSwipe, Quanta, Birthday calendar.")}
              </p>
              <p className="text-lg leading-relaxed" style={{ color: "var(--text-primary)" }}>
                {t("about_line4", "Recently got into 3D printing (A1 Mini) and homelabbing with Proxmox on my Raspi + T480s.")}
              </p>
              <p className="text-lg leading-relaxed" style={{ color: "var(--text-primary)" }}>
                {t("about_line5", "Always looking for interesting people to work with.")}
              </p>

              <div className="pt-6">
                <a
                  href="https://github.com/NoahSeeger"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {t("about_github_link", "github.com/NoahSeeger →")}
                </a>
              </div>

              {/* GitHub Activity */}
              <div className="pt-6">
                <img
                  src="https://ghchart.rshah.org/7c3aed/NoahSeeger"
                  alt="GitHub contributions"
                  className="w-full rounded-lg"
                  style={{ filter: "brightness(0.9)" }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;