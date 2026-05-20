import { BrowserRouter, Routes, Route, useParams, useLocation, Link } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import About from "./components/About";
import Experience from "./components/Experience";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Posts from "./components/Posts";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { BlogIndex, BlogPost } from "./pages/Blog";
import { getAllPosts } from "./lib/blog";
import { MdOutlineArrowBack } from "react-icons/md";

function Home() {
  return (
    <>
      <Hero />
      <Posts />
      <About />
      <Experience />
      <Projects />
      <Contact />
    </>
  );
}

function BlogPostWrapper() {
  const { slug } = useParams();
  const post = getAllPosts().find((p) => p.slug === slug);
  return <BlogPost post={post} />;
}

function FloatingBackButton() {
  const location = useLocation();
  const isBlogPost = location.pathname.startsWith("/blog/") && location.pathname !== "/blog";
  const isBlogIndex = location.pathname === "/blog";

  if (!isBlogIndex && !isBlogPost) return null;

  return (
    <Link
      to={isBlogPost ? "/blog" : "/"}
      className="fixed top-6 left-6 z-50 flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
    >
      <MdOutlineArrowBack size={24} />
    </Link>
  );
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <BlogRoutes />
      </BrowserRouter>
    </HelmetProvider>
  );
}

function BlogRoutes() {
  const location = useLocation();
  const isBlog = location.pathname.startsWith("/blog");

  return (
    <>
      {!isBlog && <Header />}
      <FloatingBackButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPostWrapper />} />
      </Routes>
      {!isBlog && <Footer />}
    </>
  );
}

export default App;