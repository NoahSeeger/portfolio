import React, { useState, useEffect } from "react";
import { FaEnvelope } from "react-icons/fa6";
import { motion } from "framer-motion";

function EmailBubble() {
  const [isHovered, setIsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.a
      href="mailto:noahseeger@outlook.de"
      className="relative flex items-center rounded-full border-2 border-gray-300 text-gray-600 hover:border-purple-accent hover:text-purple-accent transition-colors duration-300 overflow-hidden w-12 md:w-auto"
      style={{ height: 48 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        width: isDesktop && isHovered ? "auto" : 48,
        minWidth: 48,
        paddingLeft: isDesktop && isHovered ? 12 : 0,
        paddingRight: isDesktop && isHovered ? 12 : 0,
        justifyContent: isDesktop && isHovered ? "flex-start" : "center",
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      whileTap={{ scale: 0.95 }}
      aria-label="Email"
    >
      <div className="flex items-center justify-center min-w-[48px] h-full">
        <FaEnvelope size={24} />
      </div>
      <motion.div
        className="overflow-hidden whitespace-nowrap h-full flex items-center"
        animate={{ opacity: isDesktop && isHovered ? 1 : 0, width: isDesktop && isHovered ? "auto" : 0 }}
        transition={{ duration: 0.15 }}
      >
        <span className="text-sm font-medium">
          noahseeger@outlook.de
        </span>
      </motion.div>
    </motion.a>
  );
}

export default EmailBubble;