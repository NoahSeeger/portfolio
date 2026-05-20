import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa6";
import { motion } from "framer-motion";

function EmailBubble() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href="mailto:noahseeger@outlook.de"
      className="relative flex items-center rounded-full border-2 border-gray-300 text-gray-600 hover:border-purple-accent hover:text-purple-accent transition-colors duration-300 overflow-hidden"
      style={{ height: 48 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        width: isHovered ? "auto" : 48,
        minWidth: 48,
        paddingLeft: isHovered ? 12 : 0,
        paddingRight: isHovered ? 12 : 0,
        justifyContent: isHovered ? "flex-start" : "center",
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
        animate={{ opacity: isHovered ? 1 : 0, width: isHovered ? "auto" : 0 }}
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