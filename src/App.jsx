import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { PortfolioDock } from "./components/PortfolioDock";
import Hero from "./components/Hero";
import { getAllPosts } from "./lib/blog";
import { ThemeProvider } from "./hooks/useTheme";
import { SearchProvider } from "./hooks/useSearch";

const BlogIndex = lazy(() => import("./pages/Blog").then(({ BlogIndex: Component }) => ({ default: Component })));
const BlogPost = lazy(() => import("./pages/Blog").then(({ BlogPost: Component }) => ({ default: Component })));
const SearchPage = lazy(() => import("./pages/Search").then(({ SearchPage: Component }) => ({ default: Component })));

function Home() {
  return <Hero />;
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
  return (
    <div className="relative w-full">
      <main className="max-w-4xl mx-auto px-6 pb-24 sm:px-8 lg:px-12">
        <Suspense fallback={<div className="min-h-[40vh]" aria-busy="true" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPostWrapper />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </Suspense>
      </main>
      <PortfolioDock />
    </div>
  );
}

export default App;
