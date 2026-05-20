import React, { useState } from "react";
import { motion } from "framer-motion";

function SocialIcon({ children, href, label }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center size-12 rounded-full border-2 transition-colors duration-300"
      style={{
        borderColor: isHovered ? "var(--accent)" : "var(--border)",
        color: isHovered ? "var(--accent)" : "var(--text-secondary)",
        backgroundColor: isHovered ? "var(--accent-muted)" : "var(--bg-secondary)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        rotate: isHovered ? [0, -5, 5, -5, 0] : 0,
      }}
      transition={{
        duration: isHovered ? 0.4 : 0.2,
        times: isHovered ? [0, 0.2, 0.4, 0.6, 1] : [0, 1],
      }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
    >
      {children}
    </motion.a>
  );
}

export default SocialIcon;