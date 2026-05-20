import { BrowserRouter, Routes, Route, useParams, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import About from "./components/About";
import { FloatingNav } from "./components/FloatingNav";
import Hero from "./components/Hero";
import Posts from "./components/Posts";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { BlogIndex, BlogPost } from "./pages/Blog";
import { SearchPage } from "./pages/Search";
import { getAllPosts } from "./lib/blog";
import { ThemeProvider } from "./hooks/useTheme";
import { SearchProvider } from "./hooks/useSearch";

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

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <SearchProvider>
            <BlogRoutes />
          </SearchProvider>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}

function BlogRoutes() {
  const location = useLocation();
  const isBlog = location.pathname.startsWith("/blog");

  return (
    <>
      <FloatingNav />
      <main className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPostWrapper />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </main>
      {!isBlog && <Footer />}
    </>
  );
}

export default App;