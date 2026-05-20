import React, { useState } from "react";
import { motion } from "framer-motion";

function SocialIcon({ children, href, label }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center size-12 rounded-full border-2 border-gray-300 text-gray-600 hover:border-purple-accent hover:text-purple-accent transition-colors duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={isHovered ? {
        rotate: [0, -5, 5, -5, 0],
      } : {
        rotate: 0,
      }}
      transition={isHovered ? {
        duration: 0.4,
        times: [0, 0.2, 0.4, 0.6, 1],
      } : {
        duration: 0.2,
      }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
    >
      {children}
    </motion.a>
  );
}

export default SocialIcon;