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
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen w-full flex flex-col md:flex-row justify-center items-center gap-8 px-4 py-8"
    >
      <motion.div
        whileHover={{
          scale: 1.05,
          rotate: [0, -2, 2, -2, 0],
          transition: {
            duration: 0.5,
          },
        }}
        className="w-64 h-64 md:w-80 md:h-80"
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
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-center md:text-left"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl text-gray-600"
        >
          {t("hero_greeting", "Hallo, Ich bin")}
        </motion.span>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold my-2"
        >
          {t("header_name", "Noah Seeger")}
        </motion.h1>

        <TextShimmer
          duration={2.5}
          className="text-2xl md:text-3xl mb-4 font-medium [--base-color:theme(colors.blue.600)] [--base-gradient-color:theme(colors.blue.200)] dark:[--base-color:theme(colors.blue.700)] dark:[--base-gradient-color:theme(colors.blue.400)]"
        >
          {t("hero_job", "Angehender Entwickler")}
        </TextShimmer>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-6 flex flex-row gap-4 justify-center md:justify-start"
        >
          <SocialIcon href="https://github.com/NoahSeeger" label="GitHub">
            <FaGithub size={24} />
          </SocialIcon>
          <SocialIcon href="https://www.linkedin.com/in/noahseeger/" label="LinkedIn">
            <FaLinkedin size={24} />
          </SocialIcon>
          <SocialIcon href="https://x.com/thenoahsee" label="X">
            <FaXTwitter size={24} />
          </SocialIcon>
          <SocialIcon href="https://discord.com/users/noahsee" label="Discord">
            <FaDiscord size={24} />
          </SocialIcon>
          <EmailBubble />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

export default Hero;
