import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdOutlineArrowBack } from "react-icons/md";

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
      className="fixed top-6 left-6 z-50 flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
    >
      <MdOutlineArrowBack size={24} />
    </Link>
  );
}