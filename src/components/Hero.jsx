import React from "react";
import me from "../assets/personal/me.png";
import { FaGithub, FaLinkedin, FaXTwitter, FaDiscord } from "react-icons/fa6";
import { TextShimmer } from "./utils/text-shimmer";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import SocialIcon from "./SocialIcon";
import EmailBubble from "./EmailBubble";

function Hero() {
  const { t } = useTranslation();

  const socialIcons = [
    { href: "https://github.com/NoahSeeger", label: "GitHub", icon: <FaGithub size={24} /> },
    { href: "https://www.linkedin.com/in/noahseeger/", label: "LinkedIn", icon: <FaLinkedin size={24} /> },
    { href: "https://x.com/thenoahsee", label: "X", icon: <FaXTwitter size={24} /> },
    { href: "https://discord.com/users/noahsee", label: "Discord", icon: <FaDiscord size={24} /> },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full flex flex-col md:flex-row justify-center items-center gap-8 px-4 py-8"
    >
      <motion.div
        whileHover={{
          scale: 1.05,
          rotate: [0, -2, 2, -2, 0],
          transition: { duration: 0.5 },
        }}
        className="w-64 h-64 md:w-80 md:h-80"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <img
          src={me}
          alt={t("hero_img_alt", "Noah Seeger")}
          className="rounded-full w-full h-full object-cover shadow-lg"
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center md:text-left"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-xl text-gray-600"
        >
          {t("hero_greeting", "Hallo, Ich bin")}
        </motion.span>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold my-2"
        >
          {t("header_name", "Noah Seeger")}
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <TextShimmer
            duration={2.5}
            className="text-2xl md:text-3xl mb-4 font-medium"
            baseColor="#007bff"
            gradientColor="#66b2ff"
          >
            {t("hero_job", "Angehender Entwickler")}
          </TextShimmer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.3 }}
          className="mt-6 flex flex-row gap-4 justify-center md:justify-start"
        >
          {socialIcons.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.08, duration: 0.3 }}
            >
              <SocialIcon href={item.href} label={item.label}>
                {item.icon}
              </SocialIcon>
            </motion.div>
          ))}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 + socialIcons.length * 0.08, duration: 0.3 }}
          >
            <EmailBubble />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

export default Hero;
