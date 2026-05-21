import React from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa6";

function Footer() {
  return (
    <footer>
      <div className="text-center pb-8">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Made with <FaHeart className="inline text-xl mx-1" style={{ color: "#ef4444" }} /> by Noah Seeger
        </p>
      </div>
    </footer>
  );
}

export default Footer;