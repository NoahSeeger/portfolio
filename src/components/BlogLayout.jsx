import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

export function BlogLayout({ children }) {
  const location = useLocation();
  const isBlogRoute = location.pathname.startsWith("/blog");

  return (
    <>
      {isBlogRoute ? (
        <>
          <FloatingBackButton />
          {children}
        </>
      ) : (
        children
      )}
    </>
  );
}

function FloatingBackButton() {
  const location = useLocation();
  const isPostPage = location.pathname.includes("/blog/");

  return (
    <Link
      to={isPostPage ? "/blog" : "/"}
      className="fixed top-6 left-6 z-50 flex items-center justify-center w-12 h-12 text-white rounded-full shadow-lg transition duration-300"
      style={{ backgroundColor: "var(--accent)" }}
    >
      <FaArrowLeft size={24} />
    </Link>
  );
}