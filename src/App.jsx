import { BrowserRouter, Routes, Route, useParams, useLocation, Link } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import About from "./components/About";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Posts from "./components/Posts";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { BlogIndex, BlogPost } from "./pages/Blog";
import { getAllPosts } from "./lib/blog";
import { FaArrowLeft } from "react-icons/fa6";

function Home() {
  return (
    <>
      <Hero />
      <Posts />
      <About />
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
      <FaArrowLeft size={24} />
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
      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPostWrapper />} />
        </Routes>
      </main>
      {!isBlog && <Footer />}
    </>
  );
}

export default App;