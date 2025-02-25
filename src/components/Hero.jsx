import React from "react";
import me from "../assets/personal/me.png";
import { FaGithub } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { TextShimmer } from "./utils/text-shimmer";
import { motion } from "framer-motion";

function Hero() {
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
            type: "spring",
            stiffness: 300,
          },
        }}
        className="w-64 h-64 md:w-80 md:h-80"
      >
        <img
          src={me}
          alt="Noah Seeger"
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
          Hallo, Ich bin
        </motion.span>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold my-2"
        >
          Noah Seeger
        </motion.h1>

        <TextShimmer
          duration={2.5}
          className="text-2xl md:text-3xl mb-4 font-medium [--base-color:theme(colors.blue.600)] [--base-gradient-color:theme(colors.blue.200)] dark:[--base-color:theme(colors.blue.700)] dark:[--base-gradient-color:theme(colors.blue.400)]"
        >
          Angehender Entwickler
        </TextShimmer>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-6 flex flex-row gap-4 justify-center md:justify-start"
        >
          <SocialLink
            href="https://github.com/NoahSeeger"
            icon={<FaGithub size={24} />}
            text="GitHub"
          />
          <motion.a
            whileHover={{
              scale: 1.05,
              backgroundColor: "#f3f4f6",
            }}
            whileTap={{ scale: 0.95 }}
            href="#CONTACT"
            className="flex items-center justify-center gap-2 border-2 border-gray-300 rounded-full w-36 font-medium p-3 hover:bg-gray-200 transition duration-300"
          >
            <IoIosMail size={24} /> Kontakt
          </motion.a>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

function SocialLink({ href, icon, text }) {
  return (
    <motion.a
      whileHover={{
        scale: 1.05,
        backgroundColor: "#f3f4f6",
      }}
      whileTap={{ scale: 0.95 }}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 border-2 border-gray-300 rounded-full w-36 font-medium p-3 hover:bg-gray-200 transition duration-300"
    >
      {icon}
      <span>{text}</span>
    </motion.a>
  );
}

export default Hero;
