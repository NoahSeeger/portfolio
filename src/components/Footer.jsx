import React from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: "var(--border)" }}>
      <div className="text-center">
        <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
          Made with <FaHeart className="inline text-xl mx-1" style={{ color: "#ef4444" }} /> by Noah Seeger
        </p>
      </div>
    </footer>
  );
}

export default Footer;