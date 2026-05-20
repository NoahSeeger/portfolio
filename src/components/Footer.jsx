import React from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="py-6 bg-white border-t border-gray-100">
      <div className="text-center">
        <p className="text-gray-500 text-sm mb-3">
          Made with <FaHeart className="inline text-xl text-red-500 mx-1" /> by Noah Seeger
        </p>
        <div className="flex justify-center gap-4 text-sm">
          <Link to="/privacy" className="text-gray-400 hover:text-purple-accent transition-colors">
            Datenschutz
          </Link>
          <span className="text-gray-300">·</span>
          <Link to="/impressum" className="text-gray-400 hover:text-purple-accent transition-colors">
            Impressum
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;